'''
Business: Проверка email, телефона или логина на наличие в базе утечек
Args: event - dict с httpMethod, queryStringParameters (type, value)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response с результатами проверки
'''

import json
import os
import psycopg2
from typing import Dict, Any, List, Tuple

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    data_type = params.get('type', 'email')
    data_value = params.get('value', '')
    
    if not data_value:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Value parameter is required'})
        }
    
    if data_type not in ['email', 'phone', 'login']:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid type. Must be email, phone, or login'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    query = '''
        SELECT b.name, b.date, b.records
        FROM leaked_data ld
        JOIN breaches b ON ld.breach_id = b.id
        WHERE ld.data_type = %s AND ld.data_value = %s
    '''
    
    cursor.execute(query, (data_type, data_value))
    results: List[Tuple] = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    if not results:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'type': 'safe',
                'count': 0,
                'breaches': []
            })
        }
    
    breaches = [f"{name} {date}" for name, date, records in results]
    count = len(breaches)
    
    result_type = 'danger' if count >= 3 else 'warning' if count >= 1 else 'safe'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'type': result_type,
            'count': count,
            'breaches': breaches
        })
    }
