# Créer une route

## Controllers
- Créer dans le dossier controllers un dossier et un fichier
- Dans celui-ci créer des fonctions pour chaque routes voulues, en prenant exemple sur :
````
exports.findOne = (req,res,next) => {
    try{
        ...
        res.status(200).json()
    } catch(err) {
        res.status(500).json(err)
    }
};
````

## Routes
- Dans le dossier routes, créer un dossier et un fichier
- Ajouter le nom de la route avec son path et le nom de la fonction du controller :
````
/**
 * @method - GET, POST, PUT ou DELETE
 * @param - param
 * @description - Description de la route
 */
router.put("/", NomDeLaRouteDuController );
````
- Ajouter dans les exports du index.js du dossier routes, le nom de la route en majuscule et le chemin vers la route du dossier route :
````
USER: require('./Users/users'),
````

## Server
- Ajouter dans server.js le début de la route, avec le nom de la route qui a été nommé dans index.js
````
app.use('/api/users', USER)
````