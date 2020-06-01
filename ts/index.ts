/**
 * Zong Deng
 * zongd@mtu.edu
 */

import {
	BusRoute,
	getBusRouteForInput,
	getBusRouteNames,
	getOperationDay,
	getOperationHour,
	getStopsFromBusRoute,
	containStop
} from "./BusSchedules";
import {KBBot, KBResponse, KBMessage} from "@elijahjcobb/keybase-bot-builder";
import * as Path from "path";
import * as FS from "fs";

function nameOfDay(input: number): string {
	switch (input) {
		case 1: {
			return "Monday";
		}
		case 2: {
			return "Tuesday";
		}
		case 3: {
			return "Wednesday";
		}
		case 4: {
			return "Thursday";
		}
		case 5: {
			return "Friday";
		}
		case 6: {
			return "Saturday";
		}
		case 7: {
			return "Sunday";
		}
		default: {
			return "everyday";
		}

	}
}

function dontTrackThatRoute(): string {
	return "Whoops! I don't track that route. I track the following routes: " +
		getBusRouteNames().join("--> ") + ".\n" + printHelp(false);
}

function routeExist(line: string): boolean {
	const route: BusRoute | undefined = getBusRouteForInput(line);	//get BusRoute associated with line
	if (!route) {
		return false;	// no route
	} else {
		return true;
	}

}

/**
 * return route of the line
 * @param routeName The name of the route.
 */
function getStops(routeName: string): string {
	const route: BusRoute | undefined = getBusRouteForInput(routeName);	// get BusRoute associated with line

	if (routeExist(routeName)) {
		// @ts-ignore
		return ("The route " + routeName + " goes through the following stops: \n" + getStopsFromBusRoute(route).join("-->") + ".");
	} else {
		return dontTrackThatRoute();
	}
}

/**
 * array of BusRoute containing the specified stop
 * @param stop
 */
function routesToStop(stop: string): string[] | undefined {
	let i: number;
	let answer: string[] = [];
	const routes: string[] = getBusRouteNames();	// string of route names

	for (i = 0; i < routes.length; i++) {
		if (containStop(getBusRouteForInput(routes[i]), stop)) {
			console.log("there are routes contain stop " + stop);
			console.log(routes[i]);
			// @ts-ignore
			answer = answer.concat(routes[i]);
		}
	}
	console.log("array of BusRoute for routeToStop:" + answer);

	if (answer === []) {
		return undefined;
	} else {
		return answer;
	}
}

/**
 * checks to see which routes stop by the stop
 * @param stop
 */
function routeFromStop(stop: string): string {
	// let i: number;
	// let answer:string =" ";
	// let routes = getBusRouteNames();
	// for(i=0;i<routes.length;i++)
	// {
	// 	if(containStop(getBusRouteForInput(routes[i]),stop))	// if route contains the stop
	// 	{
	// 		answer.concat(routes[i]+", ");
	// 	}
	// }

	const answer: string | undefined = routesToStop(stop)?.join(", ");
	if (answer === undefined) return "No routes passes through stop " + stop + "\n" + printHelp(false);
	else return "The following route(s) pass through stop " + stop + ":\n" + answer;

}

/**
 * return operation days in a week and time duration
 * @param line
 */
function busHour(line: string): string {
	const route: BusRoute | undefined = getBusRouteForInput(line);	// get BusRoute associated with line

	if (routeExist(line))	// path exist
	{
		let i: number;
		let dayInWeek: string = "";
		const days: number[] = getOperationDay(route);
		for (i = 0; i < days.length; i++) {
			dayInWeek = dayInWeek + nameOfDay(days[i]) + ", ";
		}
		console.log(dayInWeek);
		// @ts-ignore
		return "The route " + line + " operates every " + dayInWeek +
			"from " + getOperationHour(route)[0] + " to " + getOperationHour(route)[1] + ".";
	} else {
		return dontTrackThatRoute();
	}
}

function stopHour(stop: string): string {

	let answer: string = "Buses go to stop " + stop + " every ";	// to return
	const routes: string[] | undefined = routesToStop(stop);	//array of String route name

	if (!routes) return "No routes goes through stop " + stop + ".";

	for (let i: number = 0; i < routes.length; i++) // loop through all routes that go through the stop
	{
		const stops: string[] = getStopsFromBusRoute(getBusRouteForInput(routes[i]));
		for (let j: number = 0; j < stops.length; i++)	// loop through each stop of that route, string
		{
			if (stops[j].toLowerCase() === stop.toLowerCase())	// stop matched
			{

				const route: BusRoute | undefined = getBusRouteForInput()
				const time: number[] = getBusRouteForInput(routes[i])?[2][j];
				answer += time.join(", ");
			}
		}
		answer = answer.concat(" minutes every hour from " + getOperationHour(getBusRouteForInput(routes[i]))[0] +
			" to " + getOperationHour(getBusRouteForInput(routes[i]))[1]);
	}
	return answer;
}

/**
 * list all commands or tell how to do so
 * @param switcher
 */
function printHelp(switcher: boolean): string {
	let words: string;
	if (switcher) {
		words = "Here are a list of available commands for shuttle schedule:\n" +
			"\"!shuttle route *_name of route_*\" : list all stops of this shuttle line\n" +
			"\"!shuttle stop *_name of stop_*\" : list Route(s) going through said stop\n" +
			"\"!shuttle hour *_name of route_*\" : hour of operation for said Route\n" +
			"\"!shuttle time *_name of stop_*\" : time of day each shuttle line goes through said stop";
	} else {
		words = "For a list of available commands for shuttle schedule related function:\n" +
			"Please use the following command: *!shuttle help*";
	}
	return words;
}

(async (): Promise<void> => {

		// const bot: KBBot = await KBBot.init("blizzard_t_husky", "./blizzard_paper_key",
		// 	{
		// 		logging: true,
		// 		debugging: true,
		// 		hostname: "bot-blizzard-ZD"
		// 	}
		// );
		const paperKeyPath: string = Path.resolve("blizzard_paper_key.txt");    // using paper key: "stage pisto..."
		const paperKeyData: Buffer = FS.readFileSync(paperKeyPath);
		const paperKey: string = paperKeyData.toString("utf8");
		const bot: KBBot = await KBBot.init("blizzard_t_husky", paperKey,
			{
				logging: true,
				debugging: true,
				hostname: "bot-blizzard-ZD"
			}
		);


		bot.command(
			{
				name: "shuttle",
				description: "check shuttle",
				usage: "!shuttle route City Commuter",
				handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

					const params: (string | number)[] = msg.getParameters();
					// const location: string = params.join(" ");
					console.log(params);
					// const route: BusRoute | undefined = getBusRouteForInput(location);
					//
					// if (!route) {
					// 	await res.send("Whoops! I don't track that route. I track the following routes: " +
					// 		getBusRouteNames().join(", ") + ".");
					// 	return await res.send(printHelp(false));
					//
					// } else
					// {
					// 	// const items:object[] = Object.values(route);	// get the values of array of key value pair array
					// 	await res.send("The route goes through the following stops: \n"+getStopsFromBusRoute(route).join("-->")+ ".");
					// }

					if (params.length > 1)		// check valid length of command
					{
						if (typeof params[0] === "string")		//check string command
						{
							let wordsToReturn: string = "what now?";
							let location = params.slice(1, params.length).join(" ");
							console.log("location is: " + location);
							// params[0] = params.toString().toLowerCase();
							if (params[0] === "route") {
								console.log("I read route.");
								wordsToReturn = getStops(location);
							} else if (params[0] === "stop") {
								console.log("I read stop.");
								wordsToReturn = routeFromStop(location);
							} else if (params[0] === "hour") {
								console.log("I read hour.");
								wordsToReturn = busHour(location);
							} else if (params[0] === "time") {
								console.log("I read time.");
								wordsToReturn = stopHour(location);
							} else if (params[0] === "help") {
								console.log("I read help.");
								return await res.send(printHelp(true));
							} else {
								wordsToReturn = "Whoops! Sorry not sure I can help that " + printHelp(false);
							}

							await res.send(wordsToReturn);
						} else {
							await res.send("Please only use string as command. " + printHelp(false));
						}
					} else	// not enough command arguments
					{
						await res.send("Whoops! Sorry not sure I can help that " + printHelp(true));
					}


					// if(input.length>0)	// input contains actual command
					// {
					// 	if(typeof input[0]==="string")	// make sure that commands are string instead of number
					// 	{
					// 		if(input[0]==="route")		// check for route of certain line
					// 		{
					//
					// 		} else
					// 			if(input[0])
					// 	}
					// 	if(input[0]==="route")
					// 	{
					//
					// 	}
					// }

				}
			}
		);

		bot.start();
	}
)()
	.then((): void => {
	})
	.catch((err: any): void => console.error(err));