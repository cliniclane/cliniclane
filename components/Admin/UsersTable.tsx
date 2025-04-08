"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    // SheetDescription,
    // SheetHeader,
    // SheetTitle,
    // SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Articles, Users } from "@prisma/client"
import toast from "react-hot-toast"


const createColumns = ({
    setSelectedUserId,
    setIsSheetOpen,
    setIsPasswordChangeModalOpen
}: {
    setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>
    setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsPasswordChangeModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ColumnDef<Users>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("role")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "password",
            header: () => <div className="text-right">Password</div>,
            cell: ({ row }) => {
                // const amount = parseFloat(row.getValue("password"))

                // Format the amount as a dollar amount
                // const formatted = new Intl.NumberFormat("en-US", {
                //     style: "currency",
                //     currency: "USD",
                // }).format(amount)

                return <div className="text-right font-medium">{row.getValue("password")}</div>
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created At
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "assignedBlogs",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className=""
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Assigned Blogs
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const role = row.getValue("role");
                const assignedBlogs = row.getValue("assignedBlogs") as string[]; // Cast to expected type
                return <div className="lowercase text-center">{
                    role === "super_admin" ? "_" : assignedBlogs.length
                }</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {

                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(`Email: ${user.email}\nPassword: ${user.password}`)
                                    toast.success("Credentials copied to clipboard")
                                }}
                            >
                                Copy Credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUserId(user.id);
                                    setIsSheetOpen(true);
                                }}
                            >
                                Assign Blogs
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setIsPasswordChangeModalOpen(true);
                                    setSelectedUserId(user.id);
                                }}
                            >
                                Change Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Block</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                )
            },
        },
    ]

const BlogsTable = ({
    blogs,
    selectedBlogs,
    setSelectedBlogs,
}: {
    blogs: Articles[]
    selectedBlogs: Set<string>
    setSelectedBlogs: React.Dispatch<React.SetStateAction<Set<string>>>
}) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const filteredBlogs = React.useMemo(() => {
        return blogs.filter(
            (blog) =>
                blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.language?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [blogs, searchTerm])

    const columns: ColumnDef<Articles>[] = [
        {
            id: "select",
            header: ({ }) => (
                <Checkbox
                    checked={selectedBlogs.size === filteredBlogs.length && selectedBlogs.size > 0}
                    // checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        const newSet = new Set(selectedBlogs)
                        if (value) {
                            filteredBlogs.forEach((blog) => newSet.add(blog.id))
                        } else {
                            newSet.clear()
                            // filteredBlogs.forEach((blog) => newSet.delete(blog.id))
                        }
                        setSelectedBlogs(newSet)
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => {
                const blog = row.original
                return (
                    <Checkbox
                        checked={selectedBlogs.has(blog.id)}
                        onCheckedChange={(value) => {
                            const newSet = new Set(selectedBlogs)
                            if (value) newSet.add(blog.id)
                            else newSet.delete(blog.id)
                            setSelectedBlogs(newSet)
                        }}
                        aria-label="Select row"
                    />
                )
            },
            enableSorting: false,
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
        },
        {
            accessorKey: "language",
            header: "Language",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("language")}</div>
            ),
        },
    ]

    const table = useReactTable({
        data: filteredBlogs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
    })

    return (
        <div>
            <Input
                placeholder="Search by slug or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <p className="text-sm text-gray-600">
                Selected: {selectedBlogs.size}
            </p>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No blogs found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}


export default function UsersTable({
    data,
    blogs,
    setData
}: {
    data: Users[]
    blogs: Articles[]
    setData: React.Dispatch<React.SetStateAction<Users[] | null>>
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [isCreateUserOpen, setIsCreateUserOpen] = React.useState(false);
    const [selectedBlogs, setSelectedBlogs] = React.useState<Set<string>>(new Set())
    const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = React.useState(false)

    // ✅ State for Sheet
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [newPassword, setNewPassword] = React.useState("")

    // ✅ Pass state setters to createColumns
    const columns = React.useMemo(
        () => createColumns({ setSelectedUserId, setIsSheetOpen, setIsPasswordChangeModalOpen }),
        [setSelectedUserId, setIsSheetOpen, setIsPasswordChangeModalOpen]
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    // Create new user
    const handleCreateUserSubmit = async () => {

        // Validate email and password
        if (password.length < 5) {
            toast.error("Password must be at least 5 characters long")
            return
        }

        if (email.length < 5) {
            toast.error("Email must be at least 5 characters long")
            return
        }

        setLoading(true)
        const newUser = {
            email,
            password,
        }
        const URL = "/api/users"

        // Add new user to the database
        try {
            const res = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            })

            if (!res.ok) {
                throw new Error("Failed to add new user")
            }
            toast.success("New user added successfully")
            const user: Users = await res.json()
            // Add new user to the list
            setData([...data, user])
            setEmail("")
            setPassword("")
        }
        catch (error) {
            console.error(error)
            toast.error("Failed to add new user")
        }
        finally {
            setLoading(false)
            setIsCreateUserOpen(false)
        }
    }

    // AssignBlogs
    const handleAssignBlogs = async () => {

        setLoading(true)

        // Fetch selected blogs
        const selectedBlogsData = Array.from(selectedBlogs).join(",")

        // Update user's blogs
        const updatedUser = {
            id: selectedUserId,
            blogs: selectedBlogsData,
        }

        const URL = `/api/users`
        try {
            const res = await fetch(URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            })

            if (!res.ok) {
                throw new Error("Failed to assign blogs to the user")
            }
            toast.success("Blogs assigned successfully")

            // update state
            setData(data.map((user) =>
                user.id === selectedUserId ? { ...user, assignedBlogs: selectedBlogsData.split(",") } : user
            ))
        }
        catch (error) {
            console.error(error)
            toast.error("Failed to assign blogs to the user")
        }
        finally {
            setLoading(false)
            setIsSheetOpen(false)
        }
    }

    React.useEffect(() => {
        if (selectedUserId) {
            const user = data.find((user) => user.id === selectedUserId);
            if (user) {
                const preSelected = new Set(user.assignedBlogs.map((blog) => blog));
                setSelectedBlogs(preSelected);
            }
        } else {
            setSelectedBlogs(new Set()); // Clear selection when no user is selected
        }
    }, [selectedUserId, data]);

    const areSetsEqual = (setA: Set<string>, setB: Set<string>): boolean => {
        if (setA.size !== setB.size) return false;
        for (const item of setA) {
            if (!setB.has(item)) return false;
        }
        return true;
    };

    const handlePasswordChange = async () => {
        if (newPassword.length < 5) {
            toast.error("Password must be at least 5 characters long")
            return
        }

        setLoading(true)
        const updatedUser = {
            id: selectedUserId,
            password: newPassword,
        }
        const URL = "/api/users/password"

        // Add new user to the database
        try {
            const res = await fetch(URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            })

            if (!res.ok) {
                throw new Error("Failed to add new user")
            }
            toast.success("Password updated successfully")
            setNewPassword("")
            // update user password
            setData(data.map((user) =>
                user.id === selectedUserId ? { ...user, password: newPassword } : user
            ))
        }
        catch (error) {
            console.error(error)
            toast.error("Failed to update password")
        }
        finally {
            setLoading(false)
            setIsPasswordChangeModalOpen(false)
        }
    }

    return (
        <div className="w-full">
            <Sheet open={isSheetOpen} onOpenChange={
                (isopen) => {
                    if (isopen) {
                        setIsSheetOpen(true)
                    } else {
                        setIsSheetOpen(false)
                        const user = data.find((user) => user.id === selectedUserId);
                        if (user) {
                            const preSelected = new Set(user.assignedBlogs.map((blog) => blog));
                            setSelectedBlogs(preSelected);
                        } else {
                            setSelectedBlogs(new Set()) // Clear selection when no user is selected
                        }
                    }
                }
            }>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <h2 className="text-lg font-bold">Assign Blogs</h2>

                    <div className="w-full h-[70vh] mt-5 overflow-y-auto p-1">

                        <BlogsTable
                            blogs={blogs}
                            selectedBlogs={selectedBlogs}
                            setSelectedBlogs={setSelectedBlogs}
                        />

                    </div>

                    <Button className="mt-4"
                        onClick={
                            () => handleAssignBlogs()
                        }
                        disabled={
                            areSetsEqual(
                                selectedBlogs,
                                new Set(data.find((user) => selectedUserId === user.id)?.assignedBlogs || [])
                            ) || loading
                        }

                    >
                        Assign {selectedBlogs.size} Blogs</Button>

                </SheetContent>
            </Sheet>
            <div className="grid lg:grid-cols-6 gap-2 items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="lg:max-w-sm col-span-2"
                />
                <div></div>
                <div></div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-auto lg:min-w-[150px]">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Create User */}
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            Create
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Admin</DialogTitle>
                            <DialogDescription>
                                Create a new admin user with the provided email and password.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Email
                                </Label>
                                <Input id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={
                                handleCreateUserSubmit
                            } type="submit"
                                disabled={loading}
                            >
                                {loading && < Loader2 className="animate-spin" />}
                                Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                {/* Password Dialog */}
                <Dialog open={isPasswordChangeModalOpen} onOpenChange={setIsPasswordChangeModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Enter the new password for the user.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input id="password" value={newPassword} onChange={(e) => {
                                    setNewPassword(e.target.value)
                                }} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit"
                                onClick={handlePasswordChange}
                                disabled={loading}
                            >Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div >
    )
}
