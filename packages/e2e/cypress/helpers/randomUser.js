import isMobilePhone from 'validator/lib/isMobilePhone';
/home/vitalii/Work/Seniorly/Sly/React/packages/e2e/cypress/helpers/randomUser.js
const randChars = (characters, length = 1) => {
  let result = '';
  while (length > 0 && length--) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const fromTwo = length => randChars('23456789', length);
const fromZero = length => randChars('0123456789', length);

const randHash = () => Math.random().toString(36).substring(7);
const randPhone = () => `${fromTwo()}${fromZero(2)}${fromTwo()}${fromZero(6)}`;
export const formatPhone = phone => `${phone.substr(0, 3)}-${phone.substr(3, 3)}-${phone.substr(6)}`;

export default function randomUser() {
  const name = `Fonz ${randHash()}`;
  const lastName = `Last ${randHash()}`;
  const email = `slytest+${randHash()}@seniorly.com`;
  let phone = null;
  do {
    phone = randPhone();
  }
  while (!isMobilePhone(phone, 'en-US'));
  return {
    name,
    email,
    phone,
    formattedPhone: formatPhone(phone),
    lastName
  };
}
