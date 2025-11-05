'''
Business: Получение списка всех утечек из базы данных
Args: event - dict с httpMethod
      context - объект с атрибутами request_id, function_name
Returns: HTTP response со списком утечек
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
        SELECT id, name, date, records, description
        FROM breaches
        ORDER BY date DESC
    '''
    
    cursor.execute(query)
    results: List[Tuple] = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    breaches = [
        {
            'id': breach_id,
            'name': name,
            'date': date,
            'records': records,
            'description': description
        }
        for breach_id, name, date, records, description in results
    ]
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'breaches': breaches})
    }
