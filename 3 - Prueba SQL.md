-----------------------------------------------------
### Pregunta 1:  ---
-----------------------------------------------------
Dada la siguiente tabla:

```sql
CREATE TABLE `IMPUTACION` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Codigo_empleado` bigint(20) unsigned DEFAULT NULL,
  `Actividad` bigint(20) unsigned DEFAULT,
  `Horas` decimal(50,14) DEFAULT NULL,
  `Shared_id` varchar(128) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Codigo_empleado_index` (`Codigo_empleado`),
  KEY `Actividad_index` (`Actividad`),
  KEY `Shared_id_index` (`Shared_id`),
  KEY `Emp_act_index` (`Codigo_empleado`, `Actividad`),
  KEY `Emp_act_qc_index` (`Codigo_empleado`, `Actividad`, `Quincena`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


En el hipotetico caso de tener una aplicación que trata datos relativos a empleados.
Teniendo en cuenta lo siguiente:

- La app se integra con otra app externa que gestiona la imputación de horas de
esos empleados.
- A traves de una api recive los datos de las imputaciones de los empleados.
- La tabla de imputación contiene los datos de las horas que han invertido los
empleados en las distintas actividades / proyectos / tareas de la empresa.
- A traves de la api llegan importaciones masivas de datos, tanto añadidos como
actualizaciones, y los sistemas no comparten los mismos IDs (para la tabla de 
imputaciones) por lo que cuando se diseñó la integración se decidió usar un código
generado de hasta 128 caracteres que es único y corresponde al empleado, fecha y
actividad. **Este campo sería Shared_id en la tabla anteriormente descrita.**
- Cuando se reciben datos se buscan los Shared_id y los registros que ya existen
son actualizados mientras que el resto son añadidos.

Teniendo esto en mente, un día se descubre que hay un error en el código que se
encarga de la inserción / actualización de datos. Este error está provocando que
haya registros duplicados con el mismo Shared_id en la tabla de imputación,
incluso algunos casos en los que el número de horas no coincide. El error es
subsanado a nivel código pero ahora tenemos que limpiar la tabla de imputación.
Para ello es necesario tener en cuenta que debemos borrar los duplicados dejando
solo el último registro, el cual se supone que contiene los datos válidos.

Diseña una consulta que borre solo los datos que son erroneos. Adicionalmente,
¿Crees que la tabla tiene algún error de diseño?. De ser así, ¿Cómo la mejorarías?


-----------------------------------------------------
### Respuesta 1:  ---
-----------------------------------------------------

Seleccionaria los registros con Shared_id duplicado, los ordenaria por ID de forma descendente para coger solo los mas recientes
sin duplicados. Los registros obtenidos los insertaría en una tabla temporal. Luego borraría todos los registros que se hubiesen visto
afectados en la tabla original sin discriminar, da igual si son mas recientes o mas antiguos. Por último volcaría todos los registros
guardados en la tabla temporal sobre la tabla original y borraría la tabla temporal.

Por supuesto, antes de hacer nada, haría una copia de seguridad por lo que pueda pasar y una copia sandbox  para hacer las prueba sobre
ella para ver si el resultado es el esperado, al principio sólo usando SELECT hasta ver claro que lo que veo es lo que quiero.

```sql
CREATE TABLE `Recovery_table` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Codigo_empleado` bigint(20) unsigned NOT NULL,
  `Actividad` ENUM('trabajando','estudiando','ejercitando', 'planificando') NOT NULL,
  `Horas` TIME DEFAULT NULL,
  `Shared_id` varchar(128) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Codigo_empleado_index` (`Codigo_empleado`),
  KEY `Actividad_index` (`Actividad`),
  KEY `Shared_id_index` (`Shared_id`),
  KEY `Emp_act_index` (`Codigo_empleado`, `Actividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Insertamos en una tabla temporal, luego borramos en la original y recuperamos 
# desde esta tabla.
INSERT INTO Recovery_table(Shared_id, Codigo_empleado, Actividad, Horas) 
VALUES(
    SELECT DISTINCT(t2.Shared_id), t2.Codigo_empleado, t2.Actividad, t2.Horas FROM (
        # Seleccionamos solo los registros duplicados con el ID mas grande. Conseguimos esto 
        # Ordenandolos de forma descendente. Estos registros son los que queremos salvar
        # porque al ser el ID un primary key con autoincremento, los mas grandes seran los
        # ultimos añadidos o actualizados.

        SELECT DISTINCT(a.Shared_id), a.ID, a.Codigo_empleado, a.Actividad, a.Horas FROM IMPUTACION AS a 
            INNER JOIN IMPUTACION AS b 
            ON a.Shared_id = b.Shared_id AND a.ID <> b.ID order by ID DESC LIMIT @rows
    ) as t2

DELETE FROM IMPUTACION as a
    -> INNER JOIN IMPUTACION as b
    -> where a.Shared_id = b.Shared_id and a.ID <> b.ID;
);

INSERT INTO IMPUTACION(Shared_id, Codigo_empleado, Actividad, Horas) 
VALUES( SELECT * FROM Recovery_table ) ;

DROP TABLE Recovery_table;
```

- La columna `Codigo_empleado` está definida como una clave y tiene el valor predefinido como nulo. Aunque de primeras no da error no creo que eso esté bien.
- La columna `Actividad` está definida como `bigint(20) unsigned DEFAULT`. El `DEFAULT` necesita de ir acompañado de algún valor al lado.
- La columna `Actividad` en principio yo la definiría como un `ENUM` en vez de un `bigint` (presumo que hay una cantidad limitada y conocida de actividades).
- La columna `Horas` está definida como `decimal(50,14)`, no le veo mucho sentido. Podría usarse un timestamp usando `SELECT NOW() +1` y posteriormente.
  calcular con precisión de milisegundos las horas haciendo `SELECT Horas - NOW()`. Sin embargo el tipo de dato `TIME` seguramente sea más que suficiente.

- La columna `Shared_id` quizás debería de ser `UNIQUE KEY` en vez de simplemente `KEY`.
- No le veo mucho sentido a que exista un `ID` y `Shared_id` siendo ambos simplemente `KEY` sin particionar y sin ser claves compuestas. ¿Quizás `Shared_id` sea un `FOREIGN KEY`?
- La última línea creo que se coló de una consulta de otra tabla. La columna `Quincena` no existe en ésta.
- Quizás sea buena idea tener columnas para `Fecha_insercion` y `Fecha_ultima_actualizacion`.


-----------------------------------------------------
### Pregunta 2: ---
-----------------------------------------------------
Dada la siguiente consulta

```sql
SELECT
    distinct(`TABLE_B`.`field_4780`)  AS  `country`,
    `TABLE_A`.`field_4302`  AS `entity_name`,
    ( Round(Sum(`TABLE_C`.`field_3877`), 0) ) AS `amount`, 
    ( Round(Sum(`TABLE_C`.`field_3881`), 0) ) AS `budget_deviation_amount`,
    ( Round(Sum(`TABLE_C`.`field_3878`), 0) ) AS `budget_amount`,
	`TABLE_E`.`TEXT_FIELD_E` AS `Description`
FROM  `TABLE_C` 
    INNER JOIN `TABLE_F` ON `TABLE_C`.`field_3874` = `TABLE_F`.`id` 
    INNER JOIN `TABLE_D` ON `TABLE_C`.`field_3873` = `TABLE_D`.`id` 
    INNER JOIN `TABLE_E` ON `TABLE_F`.`id` = `TABLE_E`.`field_4024` 
    LEFT JOIN `TABLE_G` ON (
        `TABLE_E`.`field_4033` = `TABLE_G`.`id` AND
        `TABLE_E`.`field_4034` = `TABLE_G`.`field_4015` AND
        `TABLE_E`.`TEXT_FIELD_E` = `TABLE_G`.`TEXT_FIELD_G`
    )
    INNER JOIN `TABLE_H` ON `TABLE_D`.`id` = `TABLE_H`.`field_4785` 
    INNER JOIN `TABLE_A` ON `TABLE_D`.`id` = `TABLE_A`.`field_4052`
    INNER JOIN `TABLE_B` ON `TABLE_H`.`field_4786` = `TABLE_B`.`id` 
WHERE 
    (
        UPPER(`TABLE_A`.`field_4302`) = 'ENTITY' OR
        `TABLE_B`.`field_4302` like 'SECONDARY%'
    ) AND
    `TABLE_A`.`field_4307` = 1 
GROUP  BY
    `TABLE_E`.`field_4033`, 
	`TABLE_G`.`field_4019`
    ORDER  BY `TABLE_A`.`field_4302` ASC 
LIMIT  1000;
```

Describe brevemente, como optimizarías la consulta, que cosas consideras que
deberían cambiarse y que indices añadirías a las tablas que intervienen en la
misma (si consideras que habría que añadir alguno).


-----------------------------------------------------
### Respuesta 2: ---
-----------------------------------------------------

- Seguramente `amount` , `budget_deviation_amount` y `budget_amount` podrían guardarse en el formato en el que se planeen usar en el futuro en la base de datos, y si han 
habido cambios recientes, pues actualizar los valores que habían a los que deberían de ser con los nuevos cambios. 
- " UPPER(`TABLE_A`.`field_4302`) = 'ENTITY' " otra vez se están usando formatos raros en la base de datos, esa línea parece querer prevenir cosas como eNtiTy lo cuál nunca debería de permitirse,
  sería mucho más eficiente corregir lo que esté mal y luego hacer la consulta con valores fijos. Adicionalmente, ese campo `TABLE_A`.`field_4302` tiene asociado el alias `entity_name`, no afecta
  al performance, pero causaría menos confusión usarla ya que se creó, sobre todo porque se está usando 2 veces seguidas.

- Creo que si el `order by` es sobre la `primary key` la consulta sería más. Se podría usar el comando EXPLAIN sobre la consulta para debuggear ese tipo de cosas con más calma.
- Siguiendo con lo del punto anterior, intentaría usar las mismas columnas o con el mismo tipo de dato al menos y tambien intentaría que las columnas fuesen índices.
- La columna `budget_deviation_amount` es innecesaria, ese valor se puede calcular a partir de `amount` y `budget_amount`.
- A los campos que fuese posible como el precio o el presupuesto les pondría un `NOT NULL` en la cláusula del where.
- Quizás 1.000 registros no sean necesarios, en cuyo caso trataría de reducirlo o paginarlo de 50 en 50 , por decir algo. Algo así como `LIMIT 1 , 51`.
- Los parentesis creo que se pueden quitar todos. Pero desde luego los que no produzcan ningún cambio deberían de quitarse.
- `TABLE_E`.`field_4033` se está comparando con `TABLE_G`.`id`, posiblemente pueda ser un `FOREIGN KEY` y `TABLE_H`.`field_4786` tambien por el mismo motivo (se compara con el id: `TABLE_B`.`id`) .
- Siguiendo con el punto de arriba es posible que `TABLE_E`.`field_4033` deba ser un indice compuesto con `TABLE_G`.`field_4019`, 
- Lo mismo aquí: `TABLE_C`.`field_3874` = `TABLE_F`.`id`
                 `TABLE_C`.`field_3873` = `TABLE_D`.`id`.

- Por último no se me ocurre otra cosa que dividir el query en queries más pequeñas en caso de ser necesario.
