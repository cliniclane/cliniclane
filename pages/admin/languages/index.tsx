import Sidebar from '@/components/Admin/Sidebar'
import { Languages as ILanguages } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'

const Languages = () => {

    const { data: session, status } = useSession()
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [isModalOopen, setIsModalOpen] = useState(false)

    const [languages, setLanguages] = useState<ILanguages[] | null>(null);

    const handleCreate = async () => {
        const URL = "/api/languages"
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code,
                name
            })
        })

        if (!res.ok) {
            toast.error("Failed to create")
        }
        else {
            const data: ILanguages = await res.json()
            toast.success("Language created successfully")
            if (!languages) return;
            const l = [...languages, data]
            setLanguages(l)
            setIsModalOpen(false)
            setCode("")
            setName("")
        }


    }

    // Fetch users from API
    const fetchLanguages = async () => {
        const res = await fetch('/api/languages')
        const data = await res.json()
        setLanguages(data)
    }

    useEffect(() => {
        if (!languages && session) {
            fetchLanguages()
        }
    }, [languages, session]);

    if (!status) return "Loading..."

    if (session && session?.user.role !== "super_admin") return "Not authorized"

    return (
        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar selected="languages" />

            {/* Content */}
            <div className="md:pl-48 py-10 px-4 sm:px-6 mt-10 md:mt-0 w-full">
                <div className='w-full mb-10 flex flex-row-reverse'>
                    <Dialog open={isModalOopen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create +</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Language</DialogTitle>
                                <DialogDescription>
                                    Create a new language
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="code" className="text-right">
                                        Code
                                    </Label>
                                    <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={
                                    () => handleCreate()
                                } type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                {languages &&
                    (
                        <div >
                            <Table>
                                <TableCaption>A list of all languages available in system.</TableCaption>
                                <TableHeader className='bg-gray-100'>
                                    <TableRow>
                                        <TableHead className="">Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">CreatedAt</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {languages.map((language) => (
                                        <TableRow key={language.id}>
                                            <TableCell className="font-medium">{language.code}</TableCell>
                                            <TableCell>{language.name}</TableCell>
                                            <TableCell>{language.status}</TableCell>
                                            <TableCell className='text-right'>{new Date(language.createdAt).toDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Languages;