#!/bin/bash

# Variables
IP=http://comerza.dreckor.com
SERVERNAME=comerza.dreckor.com
REPO_URL="https://github.com/Dreckor/AppEntregas.git"
APP_DIR="/opt/AppEntregas"
SWAP_SIZE=2G  # Tamaño de swap adicional
NODE_OPTIONS="--max_old_space_size=1024"  # Limita la memoria de Node a 1GB
BACKEND_ENV_VARS="PORT=3000\nMONGODB_URI=mongodb://localhost/AppEntregas\nTOKEN_SECRET=scrreet122\nFRONTEND_URL=$IP"  # Variables de entorno Backend
FRONTEND_ENV_VARS="VITE_API_URL=$IP/api"  # Variables de entorno Frontend

# Paso 1: Actualizar el sistema e instalar dependencias
echo "Actualizando sistema e instalando dependencias..."
sudo apt update && sudo apt upgrade -y
sudo apt install git build-essential nginx nodejs npm -y

#instala mondodb
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
# Paso 2: Clonar el repositorio
echo "Clonando el repositorio..."
if [ -d "$APP_DIR" ]; then
    echo "El directorio de la aplicación ya existe, eliminándolo..."
    sudo rm -rf $APP_DIR
fi
git clone $REPO_URL $APP_DIR

# Paso 3: Aumentar el swap
echo "Aumentando swap..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab

# Paso 4: Crear variables de entorno para Backend
echo "Creando variables de entorno para el Backend..."
echo -e $BACKEND_ENV_VARS | sudo tee $APP_DIR/Backend/.env

# Paso 5: Desplegar el Backend (Express)
echo "Desplegando Backend..."
cd $APP_DIR/Backend
npm install
sudo rm -rf node_modules
npm install pm2 -g
sudo tee ./ecosystem.config.cjs <<EOL
module.exports = {
  apps: [
    {
      name: 'AppEntregasBackend',
      script: './src/index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }
  ]
};
EOL
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup


# Paso 6: Crear variables de entorno para el Frontend
echo "Creando variables de entorno para el Frontend..."
echo -e $FRONTEND_ENV_VARS | sudo tee $APP_DIR/Frontend/AppEntregas/.env

# Paso 7: Desplegar el Frontend (Vite)
echo "Desplegando Frontend..."
cd $APP_DIR/Frontend/AppEntregas
npm install
export NODE_OPTIONS=$NODE_OPTIONS  # Limitar la memoria de Node.js
npm run build

# Paso 8: Configurar Nginx
echo "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/appentregas <<EOL
server {
    listen 80;
    server_name $SERVERNAME;

    location /api/ {
        proxy_pass $IP:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        root $APP_DIR/Frontend/AppEntregas/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOL

sudo ln -s /etc/nginx/sites-available/appentregas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "Despliegue completo."
