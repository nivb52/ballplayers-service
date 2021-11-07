export interface PlayerCsvRow {
  id: string;
  nickname: string;
}

export { PlayerInput as ModelPlayer } from "./player.model";
// reference 
// export interface ModelPlayer {
//   id: number;
//   nickname?: string;
//   first_name?: string;
//   last_name?: string;
//   position?: string;
//   height_feet?: number;
//   height_inches?: number;
//   weight_pounds?: number;
//   team_id?: number;
//   create_date?: Date;
//   update_date?: Date;
//   is_active?: boolean;
// }

export interface PlayerOnlineDataFlattened {
  id: number;
  nickname?: string;
  first_name: string;
  last_name: string;
  position: string;
  height_feet: number | null;
  height_inches: number | null;
  weight_pounds: number | null;
  team_id: number | null;
  team_abbreviation: string | null;
  team_city: string | null;
  team_conference: string | null;
  team_division: string | null;
  team_full_name: string | null;
  team_name: string | null;
}

export interface PlayerOnlineDataFromBallOnTile {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height_feet: number | null;
  height_inches: number | null;
  weight_pounds: number | null;
  team_id: number | null;
  team_abbreviation: string | null;
  team_city: string | null;
  team_conference: string | null;
  team_division: string | null;
  team_full_name: string | null;
  team_name: string | null;
  team: {
    id: number;
    abbreviation: string | null;
    city: string | null;
    conference: string | null;
    division: string | null;
    full_name: string | null;
    name: string | null;
  };
}
