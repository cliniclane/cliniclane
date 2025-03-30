import Sidebar from '@/components/Admin/Sidebar'
import UsersTable from '@/components/Admin/UsersTable'
import { Articles, Users } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const UsersPage = () => {

    const { data: session, status } = useSession()

    const [users, setUsers] = useState<Users[] | null>(null)
    const [articles, setArticles] = useState<Articles[]>([]);


    // Fetch users from API
    const fetchUsers = async () => {
        const res = await fetch('/api/users')
        const data = await res.json()
        setUsers(data)
    }

    // Fetch articles
    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch("/api/article/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setArticles(data);
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        if (!users && session) {
            fetchUsers()
        }
    }, [users, session]);

    if (!status) return "Loading..."

    if (session && session?.user.role !== "super_admin") return "Not authorized"

    return (
        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar selected="users" />

            {/* Content */}
            <div className="md:pl-48 py-10 px-4 sm:px-6 mt-10 md:mt-0 w-full">
                {users && <UsersTable blogs={articles} data={users}
                    setData={setUsers}
                />}
            </div>
        </div>
    )
}

export default UsersPage;