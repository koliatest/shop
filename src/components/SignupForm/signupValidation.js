import memoize from 'lru-memoize';
import {createValidator, required, maxLength, email, minLength} from 'utils/validation';

const surveyValidation = createValidator({
  firstName: [required, maxLength(255)],
  lastName: [required, maxLength(255)],
  phoneNumber: [required, maxLength(20), minLength(10)],
  address: [required, maxLength(255)],
  email: [required, email, maxLength(255)],
  password: [required, minLength(6)],
  bankId: [required, minLength(1)]
});
export default memoize(10)(surveyValidation);
