import React, { useState, useEffect } from 'react';
import UserPicker from './UserPicker'
import fb from '../../../fb'

const defaults = [
    { email: "joe@joe.com", password: "joejoe" },
    { email: "ann@ann.com", password: "annann" },
    { email: "admin@admin.com", password: "adminadmin" },
    { email: "fred@fred.com", password: "fredfred" },
]

export default function LoginPicker({ setEmail, setPassword }) {

    const findAuthUser = fb.functions().httpsCallable('findAuthUser');

    const [user, setUser] = useState(null)
    const [authUser, setAuthUser] = useState(null)
    useEffect(() => {
        const handleUser = async user => {
            if (user) {
                const { email } = (await findAuthUser(user.id)).data
                setEmail(email)
                setPassword(defaults.find(user => user.email === email).password)
            }
        }
        handleUser(user)
    }, [user])

    return (
        <UserPicker set={setUser} />
    )
}