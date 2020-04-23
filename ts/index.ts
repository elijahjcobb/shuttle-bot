/**
 * Zong Deng
 * zongd@mtu.edu
 */

import {BusRoute, getBusRouteForInput, getBusRouteNames} from "./BusSchedules";
import {KBBot, KBResponse, KBMessage} from "@elijahjcobb/keybase-bot-builder";

// //  Husky Campus Shuttle Daily
// const yellow: string[] = [
// 	"Forestry Building (Lot 21/26 Sidewalk)",
// 	"Forestry Building 9Rear Parking Lot)",
// 	"SDC Main Doors",
// 	"Gates Tennis Center Front Door",
// 	"Lot 32 (St. AL's)",
// 	"Woodland (Behind Wads)",
// 	"Library Bus Stop"
// ];
//
// // Husky Campus Nightlye
// const black: string[] = [
// 	"MUB",
// 	"SDC",
// 	"Upper Heights",
// 	"Lower Heights <Stop Sign)",
// 	"Woodland (behind Wads)",
// 	"Library"
// ];
//
// // Daniell Heights Shuttle
// const red: string[] = [
// 	"MUB",
// 	"SDC",
// 	"Upper Heights",
// 	"Lower Heights",
// 	"Library"
// ];
//
// // City Commuter
// const green: string[] = [
// 	"MUB",
// 	"City Center",
// 	"Econo Foods",
// 	"Walmart",
// 	"Razorback Stop",
// 	"Houghton Ave & 4th Street",
// 	"Houghton Ave & Bridge Street",
// 	"Houghton County Courthouse",
// 	"Houghton Ave & Portage Street",
// 	"Houghton Ave & Franklin Street",
// 	"Houghton Ave & Agate Street",
// 	"Houghton Ave & Emerald Street",
// 	"MUB"
// ];
//
// // Shopping Shuttle
// const blue: string[] = [
// 	"Upper Heights",
// 	"Lower Heights",
// 	"Behind Wads",
// 	"Library",
// 	"MUB",
// 	"Econo",
// 	"Walmart"
// ];
//
// /**
//  * get stopName print route names that goes through the stop
//  * @param stop
//  */
// function getRouteName(stop: string): string {
// 	return "no output";
// }
//
// /**
//  * get route number return full route
//  * @param route
//  */
// function getRoute(route: number): string {
// 	switch (route) {
// 		case 0: {   //  Campus daily
// 			return getEachStop(yellow);
// 		}
// 		case 1: {   // Campus nightly
// 			return getEachStop(black);
// 		}
// 		case 2: {   // Daniell Heights
// 			return getEachStop(red);
// 		}
// 		case 3: {   //  City Commuter
// 			return getEachStop(green);
// 		}
// 		case 4: {   // Shopping shuttle
// 			return getEachStop(blue);
// 		}
// 		default: {
// 			return "Error for getRoute\n";
// 		}
// 	}
// }

// /**
//  * get all station names for the route
//  * @param route
//  */
// function getEachStop(route: string[]): string {
// 	const output: string = "";
// 	for (let i: number = 0; i < route.length; i++) {
// 		output.concat(route[i]);
// 		output.concat(" ");
// 	}
// 	return output;
// }


(async (): Promise<void> => {

		const bot: KBBot = await KBBot.init("blizzard_t_husky", "./blizzard_paper_key.txt",
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
				usage: "!shuttle City Commuter",
				handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

					const params: (string | number)[] = msg.getParameters();
					const location: string = params.join(" ");
					const route: BusRoute | undefined = getBusRouteForInput(location);

					if (!route) {
						return await res.send("Whoops! I don't track that route. I track the following routes: " +
							getBusRouteNames().join(", ") + ".");
					}

					await res.send(`${route}`);

				}
			}
		);

		bot.start();
	}
)()
	.then((): void => {})
	.catch((err: any): void => console.error(err));