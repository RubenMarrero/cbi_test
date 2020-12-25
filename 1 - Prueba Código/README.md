La prueba de código está divida en dos directorios, uno por cada lenguaje, que contienen
un subdirectorio "problems". Los ejercicios a resolver se encontrarán en dicho
subdirectorio.
Es necesario que escribas los casos de test para tu código tal como se indica en el
siguiente párrafo.

En ambas partes está preconfigurado un entorno de testing para que puedas
evaluar la salida de tu código, será necesario escribir pruebas que validen el correcto
funcionamiento de todos los casos de uso para cada uno de los problemas.

Puedes usar los gestores de paquetes tanto de php como de javascript para instalar
cualquier componente que te ayude a resolver los problemas.

## Cómo ejecutar las pruebas

En los siguientes ejemplos se presupone que utilizas un entorno Unix y que tienes instalado node.js, npm, php y composer.
Puedes usar entornos virtualizados como Docker o Vagrant.

### JavaScript

```
$ cd js
```
```
$ npm install
```
```
$ npm test
```

### PHP

Se presupone que utilizas php >= 5.5

```
$ cd php
```
```
$ composer install
```
```
$ composer test
```