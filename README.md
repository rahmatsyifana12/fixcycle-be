Frontend repository: https://github.com/leonardo-lim/fixcycle

### Technologies
* JavaScript
* Node.js
* Express.js
* PostgreSQL
* JWT

### Getting Started

#### Install dependencies
```
npm install
```

#### Initialize your env
```
cp .env.example .env
```

#### Generate token secret
```
npm run jwt:generate
```

#### Seed data into database
```
npm run seed
```

### Fill the .env
example:
```
DB_HOST=localhost
DB_DATABASE=fixcycle
DB_USERNAME=[your username]
DB_PASSWORD=[your pasword]
DB_PORT=5432
ACCESS_TOKEN_SECRET=[generate from JWT]
LOCAL_PORT=[your port, usually 5000]
```

#### Start the project
```
npm run start
```
