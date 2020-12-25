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

export default function navigate(numberOfIntersections, roads, start, finish) {
	const Intersections = new Set(),
          reverse_route = {},
          processing_tree = {},
          initial_tree = {}
 
    const find_nearest_edge = (Intersections,processing_tree) => {
        let nearest_distance = Infinity,
			nearest_edge = nearest_edge

        for (let intersection of Intersections) {
            if (processing_tree[intersection] < nearest_distance) {
                nearest_distance = processing_tree[intersection]
                nearest_edge = intersection
            }
        }
        return nearest_edge
    }
 
    for (let i=0;i<roads.length;i++) {
        let edge_origin = roads[i].from.toString(), 
            edge_destination = roads[i].to.toString(),
            edge_weight = roads[i].drivingTime
 
        Intersections.add(edge_origin)
		Intersections.add(edge_destination)

        processing_tree[edge_origin] = Infinity
        processing_tree[edge_destination] = Infinity
 
        if (initial_tree[edge_origin] === undefined) initial_tree[edge_origin] = {}
        if (initial_tree[edge_destination] === undefined) initial_tree[edge_destination] = {}
 
        initial_tree[edge_origin][edge_destination] = edge_weight
        initial_tree[edge_destination][edge_origin] = edge_weight
    }
    
    processing_tree[start] = 0
 
    while (Intersections.size) {
        let nearest_edge = find_nearest_edge(Intersections,processing_tree),
            neighbors = Object.keys(initial_tree[nearest_edge]).filter(v=>Intersections.has(v)) 
 
        Intersections.delete(nearest_edge)
 
        if (nearest_edge===finish) break 
 

        for (let neighbor of neighbors) {
            let tmp = processing_tree[nearest_edge] + initial_tree[nearest_edge][neighbor]
            if (tmp < processing_tree[neighbor]) {
                processing_tree[neighbor] = tmp
                reverse_route[neighbor] = nearest_edge
            }
        }
    }
 
    {
        let last_edge = parseInt(finish),
        route = [last_edge],
        totalDrivingTime = 0
 
        while (reverse_route[last_edge] !== undefined) {
            route.unshift(parseInt(reverse_route[last_edge]))
            totalDrivingTime += initial_tree[last_edge][reverse_route[last_edge]]
			last_edge = reverse_route[last_edge]
        }
        return [route,totalDrivingTime]
    }   
}