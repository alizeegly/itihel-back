# Créer un model
- Dans le dossier models, créer un dossier et un fichier js avec le nom du model
- Appeler la bibliothèque mongoose 
- Créer un schéma avec les champs
> Documentation de mongoose : [https://mongoosejs.com/docs/models.html](https://mongoosejs.com/docs/models.html)
- Exporter le model avec son nom et le schéma :
````
module.exports  = mongoose.model("User", UserSchema)
````