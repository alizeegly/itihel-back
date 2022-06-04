# Ajouter une variable dans le .env

- Ajouter la variable dans le .env, de la forme :
````
VARIABLE = "VALUE"
````

- Ajouter dans les exports du fichier config.js du dossier config, le nom de la variable du .env :
````
VARIABLE: process.env.VARIABLE
````

- Appeler dans n'importe quel fichier la variable du fichier config :
````
const { VARIABLE } = require("./config/config");
````