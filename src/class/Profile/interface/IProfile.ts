import InvoiceTypes from '../../Invoice/types/InvoiceTypes';
import IBalance from './IBalance';

interface IProfile {
  readonly fullname: string;
  readonly cuit: string;
  readonly invoiceType: InvoiceTypes;
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
