require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'name';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'db-password';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

CONFIG.backend_url = process.env.BACKEND_URL || 'http://localhost:3000';
CONFIG.frontend_url = process.env.FRONTEND_URL || 'http://localhost:4200';

CONFIG.access_allow_origin = process.env.ACCESS_ALLOW_ORIGIN || 'http://localhost:4200';

CONFIG.smtp_port = process.env.SMTP_PORT || '4650';

CONFIG.mail_config_host = process.env.MAIL_CONFIG_HOST  ||  'localhost';
CONFIG.mail_config_port = process.env.MAIL_CONFIG_PORT  ||  '4650';
CONFIG.mail_config_user = process.env.MAIL_CONFIG_USER  ||  'user';
CONFIG.mail_config_pass = process.env.MAIL_CONFIG_PASS  ||  'pass';
CONFIG.mail_config_auth = process.env.MAIL_CONFIG_AUTH  ||  'true';