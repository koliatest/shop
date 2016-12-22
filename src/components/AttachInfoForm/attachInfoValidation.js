import memoize from 'lru-memoize';
import {createValidator, email, required, maxLength } from 'utils/validation';

const surveyValidation = createValidator({
  bankEmail: [required, email, maxLength(255)],
  bankPassword: [required, maxLength(255)],
  email: [required, email]
});
export default memoize(10)(surveyValidation);
