-----------------------------------------------------
### Pregunta 1:  ---
-----------------------------------------------------

Teniendo en cuenta que tenemos una aplicación web privada que necesita de un usuario
y contraseña para poder trabajar con ella. Un día un cliente nos pide que le creemos
un sistema de Single Sign On para que sus usuarios puedan darse de alta en nuestra
aplicación con su cuenta corporativa. Pongamos que se te asigna a ti la tarea y además
queremos usar SAML para este propósito.

Describe brevemente cómo resolverías este caso y que datos crees que sería necesario
pedir al departamente técnico de este hipotetico cliente.

-----------------------------------------------------
### Respuesta 1:  ---
-----------------------------------------------------

Usaría un servidor centralizado cuya única función sería almacenar los 
usuarios, sus credenciales y privilegios/restricciones (IdP). Todas las demás
aplicaciones funcionarían con normalidad excepto cuando el usuario realice una
acción que requiera de autentificación, momento en el cual se le redirigiría
a un formulario de inicio de sesión externo (en el servidor IdP). Si el usuario
inicia sesión exitosamente en el IdP se crearía un token que es enviado de vuelta
al servidor del que venía el usuario. Mientras la sesión se mantenga activa, este
proceso no tendría por qué repetirse.

Sería necesario conocer qué tipos de aplicaciones formarán parte
del sistema SSO y también los diferentes roles posibles con sus respectivos
privilegios y restricciones. También qué tan restrictivas desearían que fuesen
las limitaciones de las sesiones: tiempo de inactividad antes de destruirse,
permitir mantener la sesión en más de un dispositivo o ubicación, etc.



-----------------------------------------------------
### Pregunta 2:  ---
-----------------------------------------------------

Teniendo una aplicación de gestión de datos un día se nos plantea que tenemos
que crear una página pública, llamemosla public.domain.com, dónde mostrar parte
de esos datos, los cuales son privados y pertenecen a una empresa, algunos de
ellos son sensibles por lo que deben ser tratados con cuidado. Para complicarnos
un poco la vida nos piden que además las personas puedan darse de alta en esta
página pública validando sus credenciales contra nuestra app de gestión y con
ello se les permite a los usuarios con cuenta (cuenta con permisos muy restringidos)
realizar un par de acciones que resultan en la modificación / añadido de algunos
datos.

Ten en cuenta que nuestra app de gestión tiene un sistema de login de usuarios
para usar la api. La página pública es serverless, estática y está alojada en
otro dominio diferente. Adicionalmente hemos de tener en cuenta que nuestra api
no está preparada para trabajar con otros dominios.

Plantea una solución a este problema y comenta brevemente que cambios crees que
deberíamos hacer en nuestra aplicación de gestión, si crees que debemos hacer
alguno.

-----------------------------------------------------
### Respuesta 2:  ---
-----------------------------------------------------

Usaría doble factor de autentificación como un código QR , o enviar un email o  un SMS. Puesto
que entiendo que ambos servidores no pueden comunicarse entre si por políticas de seguridad, 
sólo se me ocurre esa solución alternativa.

Si este contexto se ha originado a partir de unas políticas de seguridad deliberadamente restrictivas,
seguramente existan por un buen motivo y no haya que cambiar nada, de lo contrario quizás fuese buena
idea pensar en usar alguna alternativa como Amazon Lambda con un token JWT entre el cliente y el servidor.