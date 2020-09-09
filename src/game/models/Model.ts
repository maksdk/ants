import { GameModel } from '@models/GameModel';
import { BaseModel } from '@models/BaseModel';
import { UserModel } from '@models/UserModel';

export class Model extends BaseModel {
    public game!: GameModel;
    public user!: UserModel;
}
