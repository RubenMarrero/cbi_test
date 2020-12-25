"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

exports.default = navigate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
	¡El GPS se ha roto y tenemos que llegar a un sitio!

	Por suerte, tienes un mapa y tu algoritmo sigue intacto. Eso sí, tu mapa es
	un poco	extraño: todas las intersecciones están etiquetadas con números enteros
	diferentes y las  carreteras que las conectan están etiquetadas con el tiempo
	que se tarda en recorrerlas expresado en minutos.

	Te encuentras en la intersección etiquetada como "start" y tu destino es la
	interescción etiquetada como "finish".

	Dispondrás del número total de intersecciones y un array de carreteras, cada
	una de ellas con las propiedades: "from", "to" (las interesecciones están
	etiquetadas con números enteros menores que el número de intersecciones) y
	"drivingTime". Las carreteras sólo pueden ser usadas para ir desde "from" a
	"to". No hay carreteras de doble sentido.

	Completa la función para que devuelva un array de intersecciones de la ruta
	más rápida desde "start" hasta "finish" (ambas incluidas).

	Si hay vairas rutas iguales, coge cualquiera. Si no hay rutas, devuelve null.

	Ejemplo:

	var roads = [
	    {from: 0, to: 1, drivingTime: 5},
	    {from: 0, to: 2, drivingTime: 10},
	    {from: 1, to: 2, drivingTime: 10},
	    {from: 1, to: 3, drivingTime: 2},
	    {from: 2, to: 3, drivingTime: 2},
	    {from: 2, to: 4, drivingTime: 5},
	    {from: 3, to: 2, drivingTime: 2},
	    {from: 3, to: 4, drivingTime: 10}
	];
	navigate(5, roads, 0, 4);
	// devolvería [0, 1, 3, 2, 4]. Tiempo más rápido is 5 + 2 + 2 + 5 = 14 minutes

*/

// Mientras el punto de inicio, el punto de final y el orden de los nodos sea conocido
// y mientras no se permite viajar en ambos sentidos numberOfIntersections no es necesario.

function navigate(numberOfIntersections, roads, start, finish) {
    var Intersections = new _set2.default(),
        reverse_route = {},
        processing_tree = {},
        initial_tree = {};

    var find_nearest_edge = function find_nearest_edge(Intersections, processing_tree) {
        var nearest_distance = Infinity,
            nearest_edge = nearest_edge;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(Intersections), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var intersection = _step.value;

                if (processing_tree[intersection] < nearest_distance) {
                    nearest_distance = processing_tree[intersection];
                    nearest_edge = intersection;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return nearest_edge;
    };

    for (var i = 0; i < roads.length; i++) {
        var edge_origin = roads[i].from.toString(),
            edge_destination = roads[i].to.toString(),
            edge_weight = roads[i].drivingTime;

        Intersections.add(edge_origin);
        Intersections.add(edge_destination);

        processing_tree[edge_origin] = Infinity;
        processing_tree[edge_destination] = Infinity;

        if (initial_tree[edge_origin] === undefined) initial_tree[edge_origin] = {};
        if (initial_tree[edge_destination] === undefined) initial_tree[edge_destination] = {};

        initial_tree[edge_origin][edge_destination] = edge_weight;
        initial_tree[edge_destination][edge_origin] = edge_weight;
    }

    processing_tree[start] = 0;

    while (Intersections.size) {
        var nearest_edge = find_nearest_edge(Intersections, processing_tree),
            neighbors = (0, _keys2.default)(initial_tree[nearest_edge]).filter(function (v) {
            return Intersections.has(v);
        });

        Intersections.delete(nearest_edge);

        if (nearest_edge === finish) break;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(neighbors), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var neighbor = _step2.value;

                var tmp = processing_tree[nearest_edge] + initial_tree[nearest_edge][neighbor];
                if (tmp < processing_tree[neighbor]) {
                    processing_tree[neighbor] = tmp;
                    reverse_route[neighbor] = nearest_edge;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }

    {
        var last_edge = parseInt(finish),
            route = [last_edge],
            totalDrivingTime = 0;

        while (reverse_route[last_edge] !== undefined) {
            route.unshift(parseInt(reverse_route[last_edge]));
            totalDrivingTime += initial_tree[last_edge][reverse_route[last_edge]];
            last_edge = reverse_route[last_edge];
        }
        return [route, totalDrivingTime];
    }
}