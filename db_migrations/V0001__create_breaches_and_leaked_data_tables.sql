-- Создание таблицы для хранения информации об утечках
CREATE TABLE IF NOT EXISTS breaches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date VARCHAR(10) NOT NULL,
    records VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для хранения скомпрометированных данных
CREATE TABLE IF NOT EXISTS leaked_data (
    id SERIAL PRIMARY KEY,
    breach_id INTEGER REFERENCES breaches(id),
    data_type VARCHAR(20) NOT NULL CHECK (data_type IN ('email', 'phone', 'login')),
    data_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_leaked_data_value ON leaked_data(data_value);
CREATE INDEX IF NOT EXISTS idx_leaked_data_type ON leaked_data(data_type);
CREATE INDEX IF NOT EXISTS idx_breach_name ON breaches(name);

-- Вставка тестовых данных об известных утечках
INSERT INTO breaches (name, date, records, description) VALUES
('LinkedIn', '2021', '700M+', 'Утечка данных пользователей LinkedIn в 2021 году'),
('Facebook', '2019', '533M', 'Массивная утечка данных пользователей Facebook'),
('Yahoo', '2013', '3B', 'Крупнейшая утечка данных в истории Yahoo'),
('Adobe', '2013', '153M', 'Взлом базы данных пользователей Adobe'),
('Dropbox', '2012', '68M', 'Утечка паролей пользователей Dropbox');

-- Вставка примеров скомпрометированных данных
INSERT INTO leaked_data (breach_id, data_type, data_value) VALUES
(1, 'email', 'test@example.com'),
(1, 'phone', '+79001234567'),
(2, 'email', 'user@test.com'),
(2, 'login', 'testuser'),
(3, 'email', 'demo@mail.ru'),
(4, 'email', 'example@gmail.com'),
(5, 'login', 'demouser');
