import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as yup from 'yup'
import ValidationErrorPage from "../errors/ValidationErrorPage";


export default observer(function RegisterForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ displayName: '', userName: '', email: "", password: "", error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore
                    .register(values)
                    .catch((error) => setErrors({ error }))
            }
            validationSchema={yup.object({
                displayName: yup.string().required(),
                userName: yup.string().required(),
                email: yup.string().email().required().email(),
                password: yup.string().required()
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign="center" />
                    <MyTextInput name="displayName" placeholder="Display Name" />
                    <MyTextInput name="userName" placeholder="User Name" />
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password(big,small letters,symbols and numbers)" type="password" />
                    <ErrorMessage
                        name="error"
                        render={() => (
                            <ValidationErrorPage errors={errors.error} />
                        )}
                    />
                    <Button
                        loading={isSubmitting}
                        disabled={!isValid || !dirty || isSubmitting}
                        positive
                        content="Register"
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
});
