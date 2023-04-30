import IProfile from './interface/IProfile';
import ValidationException from './Exceptions/ValidationException';
import IBalance from './interface/IBalance';
import { RegisterTypes } from './types/RegisterTypes';

class Profile {
  public fullname: string;

  public cuit: string;

  public registerType: RegisterTypes;

  public salePoint: string;

  public selected: boolean;

  public balance: Array<IBalance>;

  public token: string;

  public tokenExpires: Date | null;

  public sign: string;

  public address: string;

  public initAct: Date;

  constructor({
    fullname,
    cuit,
    registerType,
    salePoint,
    selected,
    balance,
    token,
    tokenExpires,
    sign,
    address,
    initAct,
  }: IProfile) {
    const errors = Profile.validate({
      fullname,
      cuit,
      registerType,
      salePoint,
    });
    if (errors.length > 0) throw new ValidationException(errors);

    this.fullname = fullname.toLocaleUpperCase();
    this.cuit = cuit;
    this.registerType = registerType;
    this.salePoint = salePoint;
    this.selected = selected || false;
    this.balance = balance || new Array<IBalance>();
    this.token = token?.replaceAll(' ', '+') || '';
    const date = tokenExpires ? new Date(tokenExpires) : null;

    if (date) date.setHours(date.getHours() + 3);

    this.tokenExpires = date;
    this.sign = sign?.replaceAll(' ', '+') || '';
    this.address = address || '-';
    this.initAct = initAct || new Date();
  }

  public static validate({ fullname, cuit, registerType, salePoint }: IProfile) {
    const errors = [];
    if (!fullname) errors.push('Debe tener un nombre completo.');
    if (!RegExp(/[0-9]{2}-[0-9]+-[0-9]/g).test(cuit))
      errors.push('Debe tener un Cuit / Cuil valido (XX-XXXXXXXX-X)');
    if (!RegExp(/[0-9]{5}/g).test(salePoint))
      errors.push('Debe tener un Punto de venta (5 digitos)');
    if (!RegisterTypes[registerType])
      errors.push('Debe tener un tipo de inscripción valida.');

    return errors;
  }
}

export default Profile;
