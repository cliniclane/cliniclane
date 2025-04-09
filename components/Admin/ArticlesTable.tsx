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
} from "@tanstack/react-table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, ChevronDown, Import, Loader2, MoreHorizontal } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Articles } from "@prisma/client"
import toast from "react-hot-toast"
import Link from "next/link"
type RawArticle = {
    headline: string;
    datePublished: string;
    datePublishedRaw: string;
    dateModified: string;
    commonSideEffects: string[]
    dateModifiedRaw: string;
    isMdx: boolean,
    authors: {
        name: string;
        nameRaw: string;
    }[];
    breadcrumbs: {
        name: string;
        url: string;
    }[];
    inLanguage: string;
    description: string;
    articleBody: string;
    articleBodyHtml: string;
    canonicalUrl: string;
    url: string;
    metadata: {
        dateDownloaded: string;
        probability: number;
        _type: string;
    };
}


const createColumns = ({
    setIsDeleteModalOpen,
    setSelectedRow
}: {
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedRow: React.Dispatch<React.SetStateAction<Articles | null>>
}): ColumnDef<Articles>[] => [
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
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => (
                <div className="">{row.getValue("slug")}</div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("title")}</div>
            ),
        },
        {
            accessorKey: "publishDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Publish Date
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{new Date(row.getValue("publishDate")).toDateString()}</div>,
        },
        {
            accessorKey: "language",
            header: () => <div className="text-right">Language</div>,
            cell: ({ row }) => {
                return <div className="text-right capitalize font-medium">{row.getValue("language")}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const article = row.original;
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
                                asChild >
                                <Link
                                    href={`/admin/article/edit/${row.original.id}?tab=basic`}
                                >

                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                            >
                                <Link
                                    href={`/${row.getValue("language")}/${row.getValue("slug")}`}
                                >
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setIsDeleteModalOpen(true)
                                    setSelectedRow(article)
                                }}
                            >Delete</DropdownMenuItem>
                            <DropdownMenuItem>Block</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                )
            },
        },
    ]


export default function ArticleTable({
    data,
    extractedData,
    setExtractedData,
    setData,
    handleOnFileChange,
}: {
    data: Articles[]
    extractedData: Articles[] | null
    setExtractedData: React.Dispatch<React.SetStateAction<Articles[] | null>>
    setData: React.Dispatch<React.SetStateAction<Articles[] | null | undefined>>
    handleOnFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [isLoading, setIsLoading] = React.useState(false);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Articles | null>(null)


    // Sabe extracted data to database
    const handleSaveExtractedData = async () => {
        if (!extractedData) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/article/many", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articles: extractedData })
            });

            if (res.status === 200) {
                const newData = await res.json();
                console.log(newData)
                const newArticles = [...data, ...newData.data];
                // sort the data date wise
                newArticles.sort((a, b) => {
                    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
                });
                // set the data to the table
                setData(newArticles);
                toast.success("Articles imported successfully");
            }
            else {
                toast.error("Failed to import articles");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to import articles");
        }
        finally {
            setIsLoading(false);
            setExtractedData(null);
            setIsImportModalOpen(false);
        }
    }

    const stripMarkdown = (md: string) => {
        return md
            .replace(/[*_~`>#-]+/g, '')      // remove markdown syntax
            .replace(/\\\[/g, '[')           // unescape \[
            .replace(/\\\]/g, ']')           // unescape \]
            .replace(/\n{2,}/g, '\n');       // normalize new lines
    };

    // Export Article in json file
    const handleExport = () => {
        if (!data) return;

        const selectedArticles = table.getFilteredSelectedRowModel().rows.map((row) => {
            const article = row.original;

            const rawArticle: RawArticle = {
                headline: article.title || "",
                datePublished: article.publishDate || "",
                datePublishedRaw: article.publishDate || "",
                dateModified: article.publishDate || "", // assuming no separate dateModified field
                dateModifiedRaw: article.publishDate || "",
                commonSideEffects: article.tags,
                authors: [
                    {
                        name: article.author || "",
                        nameRaw: article.author || "",
                    },
                ],
                breadcrumbs: [], // Add breadcrumbs if available in original article
                inLanguage: article.language || "english",
                description: article.description || "",
                articleBody: stripMarkdown(article.mdxString),
                isMdx: true,
                articleBodyHtml: article.mdxString,
                canonicalUrl: article.canonical || "",
                url: article.canonical || "",
                metadata: {
                    dateDownloaded: new Date().toISOString(),
                    probability: 1,
                    _type: "drug-article",
                },
            };

            return rawArticle;
        });

        const jsonContent = JSON.stringify(selectedArticles, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${new Date().toISOString()}_articles.json`;
        a.click();
        URL.revokeObjectURL(url);
    };


    // Delete Article
    const deleteArticle = async (id: string) => {
        if (!data) return;
        const promise = fetch("/api/article/delete", {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.promise(promise, {
            loading: "Deleting...",
            success: () => {
                const newArticles = data.filter((article) => article.id !== id);
                setData(newArticles);
                // clear selected rows
                setRowSelection({})
                return "Article deleted successfully";
            },
            error: (res) => {
                console.log(res);
                return "Failed to delete article";
            },
        });
    };

    // Delete Multiple Articles
    const deleteSelectedArticles = async () => {
        if (!data) return;
        setIsLoading(true);
        const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
        const promise = fetch("/api/article/many", {
            method: "DELETE",
            body: JSON.stringify({ ids: selectedIds }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.promise(promise, {
            loading: "Deleting...",
            success: () => {
                const newArticles = data.filter((article) => !selectedIds.includes(article.id));
                setData(newArticles);
                // clear selected rows
                setRowSelection({})
                setIsLoading(false);
                return "Articles deleted successfully";
            },
            error: (res) => {
                console.log(res);
                setIsLoading(false);
                return "Failed to delete articles";
            },
        });
    }

    // ✅ Pass state setters to createColumns
    const columns = React.useMemo(
        () => createColumns({ setIsDeleteModalOpen, setSelectedRow }),
        [setIsDeleteModalOpen, setSelectedRow]
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

    return (
        <div className="w-full">
            <div className="grid lg:grid-cols-6 gap-2 items-center py-4">
                {/* Delete Article */}
                <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Do you want to delete this article
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently
                                delete your account and remove your data from our
                                servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    deleteArticle(selectedRow?.id || "")
                                }
                                }
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={isImportModalOpen} onOpenChange={(open) => {
                    if (open) {
                        setIsImportModalOpen(true)
                    }
                    else {
                        setIsImportModalOpen(false)
                        setExtractedData(null)
                    }
                }
                } >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Import Articles from JSON File
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <span>
                                    Select a JSON file to import your articles.
                                </span>
                                <span>
                                    Only JSON files with a `.json` extension are
                                    accepted.
                                </span>
                                <Input
                                    placeholder="Import JSON file"
                                    type="file"
                                    accept=".json"
                                    onChange={handleOnFileChange}
                                    className="my-6 h-12"
                                />
                                {
                                    extractedData && (
                                        <ul className="space-y-1">
                                            {extractedData.map((article, index) => (
                                                <li key={index} className="capitalize">
                                                    {index + 1}. {article.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                disabled={!extractedData}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSaveExtractedData();
                                }}
                            >
                                {isLoading && <Loader2 className="animate-spin" />}
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Input
                    placeholder="Filter Slug..."
                    value={(table.getColumn("slug")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("slug")?.setFilterValue(event.target.value)
                    }
                    className="lg:max-w-sm col-span-2"
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 ?
                    <Button variant="destructive" className="py-2"
                        disabled={isLoading}
                        onClick={() => deleteSelectedArticles()}>
                        {isLoading && <Loader2 className="animate-spin" />}
                        Delete {table.getFilteredSelectedRowModel().rows.length} selected
                    </Button> : <div></div>
                }

                {
                    table.getFilteredSelectedRowModel().rows.length === 0 ?
                        <Button variant="outline" className="py-2"
                            onClick={() => setIsImportModalOpen(true)}>
                            <Import />
                            Import
                        </Button>
                        : <Button variant="outline" className="py-2 bg-green-600 text-white"
                            onClick={handleExport}>
                            <Import className="rotate-90" />
                            Export
                        </Button>
                }

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

                <Button variant="default" className="py-2" asChild>
                    <Link
                        href="/admin/article/new?tab=basic"
                    >
                        New Article
                    </Link>
                </Button>
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