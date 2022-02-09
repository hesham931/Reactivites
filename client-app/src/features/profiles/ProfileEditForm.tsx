import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../../app/stores/store';
import * as yup from 'yup'
import { Button } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({setEditMode}: Props) {
    const { profileStore: {profile, updateProfile} } = useStore();


    return (
        <Formik
            initialValues={{ displayName: profile?.displayName, bio: '' }}
            onSubmit={values =>
                    updateProfile(values)
                    .then(() => setEditMode(false))
            }
            validationSchema={yup.object({
                displayName: yup.string().required()
            })}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="ui form">
                    <MyTextInput placeholder='Display Name' name='displayName' />
                    <MyTextArea rows={3} placeholder='Add your bio' name='bio' />
                    <Button
                        loading={isSubmitting}
                        disabled={!isValid || !dirty}
                        positive
                        content="Update profile"
                        floated='right'
                        type="submit"
                    />
                </Form>
            )}
        </Formik>
    )
})