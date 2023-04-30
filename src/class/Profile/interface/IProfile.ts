import { RegisterTypes } from '../types/RegisterTypes';
import IBalance from './IBalance';

interface IProfile {
  readonly fullname: string;
  readonly cuit: string;
  readonly registerType: RegisterTypes;
  readonly salePoint: string;
  readonly selected?: boolean;
  readonly balance?: Array<IBalance>;
  readonly token?: string;
  readonly tokenExpires?: Date | null;
  readonly sign?: string;
  readonly address?: string;
  readonly initAct?: Date;
}

export default IProfile;
