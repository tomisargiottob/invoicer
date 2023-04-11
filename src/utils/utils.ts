export function convertXmlToJson(xmlString: string): any {
  const jsonData: {[k:string]: string} = {};
  // eslint-disabled-next-line
  for (const result of xmlString.matchAll(
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = result[1] || result[3];
    const value = result[2] && convertXmlToJson(result[2]); //recusrion
    jsonData[key] =
      (value && Object.keys(value).length ? value : result[2]) || null;
  }
  return jsonData;
}

export function convertDateToAAAAMMDD(dateToConvert: Date) {
  const date = new Date(dateToConvert);
  const anio = date.getFullYear();
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const dia = date.getDate().toString().padStart(2, '0');
  return `${anio}${mes}${dia}`;
}

export function convertDateToDDMMAAAASeparated(dateToConvert: Date) {
  const date = new Date(dateToConvert);
  const anio = date.getFullYear();
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const dia = date.getDate().toString().padStart(2, '0');
  return `${dia}/${mes}/${anio}`;
}

export function convertDateToDDMMAAAASeparated2(dateToConvert: Date | string) {
  const date = new Date(dateToConvert);
  const anio = date.getFullYear();
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const dia = date.getDate().toString().padStart(2, '0');
  return `${dia}/${mes}/${anio}`;
}

export default {};
