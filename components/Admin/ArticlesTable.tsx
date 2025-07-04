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
import { ArrowUpDown, ChevronDown, Eye, Globe, Import, Loader2, MoreHorizontal, Pencil } from "lucide-react"
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
import { Articles, Languages } from "@prisma/client"
import toast from "react-hot-toast"
import Link from "next/link"
import { useSession } from "next-auth/react";
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
            accessorKey: "languages",
            header: () => <div className="text-right">Languages</div>,
            cell: ({ row }) => {
                const r = row.original;
                return <div className="text-right capitalize font-medium">{`${r.mdxString === "" ? "" : r.language}${r.translations?.length > 0 ? ", " : ""}${r.translations.map((l) => l.language).join(", ")}`}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <div className="flex space-x-2 pl-5">
                        <Button variant="outline" size="icon">
                            <Link
                                href={`/admin/article/edit/${row.original.id}?tab=basic`}
                                target="_blank"
                                referrerPolicy="no-referrer"
                            >
                                <Pencil />
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                            <Link
                                href={`/${row.getValue("slug")}`}
                                target="_blank"
                                referrerPolicy="no-referrer"
                            >
                                <Eye />
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                    </div>
                )
            },
        },
    ]


export default function ArticleTable({
    data,
    extractedData,
    selectedArticles,
    setSelectedArticles,
    handleCheckboxChange,
    setExtractedData,
    setData,
    handleOnFileChange,
    languages,
    selectedImportLanguage,
    setSelectedImportLanguage,
    duplicateSlugGroups,
}: {
    data: Articles[]
    selectedArticles: Articles[]
    setSelectedArticles: React.Dispatch<React.SetStateAction<Articles[]>>
    extractedData: Articles[] | null
    setExtractedData: React.Dispatch<React.SetStateAction<Articles[] | null>>
    setData: React.Dispatch<React.SetStateAction<Articles[] | null | undefined>>
    handleOnFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCheckboxChange: (article: Articles) => void
    selectedImportLanguage?: Languages | null
    languages?: Languages[] | null
    setSelectedImportLanguage: React.Dispatch<React.SetStateAction<Languages | null>>
    duplicateSlugGroups: Articles[][]
    setDuplicateSlugGroups: React.Dispatch<React.SetStateAction<Articles[][]>>
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
    const [selectedRow, setSelectedRow] = React.useState<Articles | null>(null);
    const { data: session } = useSession()
    const [isDuplicateOpen, setIsDuplicateOpen] = React.useState(false);
    const [duplicateSlugList, setDuplicateSlugList] = React.useState<string[]>([]);

    // Sabe extracted data to database
    const handleSaveExtractedData = async () => {
        if (!selectedArticles) return;
        setIsLoading(true);
        let articles;
        if (selectedImportLanguage) {
            // change language for all the articles
            articles = selectedArticles.map((article) => ({
                ...article,
                language: selectedImportLanguage.code
            })
            )
        } else {
            // change language for all the articles
            articles = selectedArticles
        }
        try {
            const res = await fetch("/api/article/many", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articles: articles, email: session?.user?.email })
            });

            if (res.status === 200) {
                const newData = await res.json();
                const updatedData = [...data]; // clone current data

                newData.data.forEach((newArticle: Articles) => {
                    const existingIndex = updatedData.findIndex(article => article.id === newArticle.id);

                    if (existingIndex !== -1) {
                        // Update existing article
                        updatedData[existingIndex] = newArticle;
                    } else {
                        // Add new article to the first position
                        updatedData.unshift(newArticle);
                    }
                });

                setData(updatedData);
                setIsImportModalOpen(false);
                setExtractedData(null);
                toast.success("Articles imported successfully");
            }
            else {
                const d = await res.json();
                if (d.error === "duplicate-slug") {
                    setDuplicateSlugList(d.data);
                    toast.error("Slug already exist");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to import articles");
        }
        finally {
            setIsLoading(false);
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


    // Remove the checked articles from the extracted data
    const handleDuplicateCheckboxChange = (article: Articles) => {
        if (selectedArticles.includes(article)) {
            setSelectedArticles(selectedArticles.filter((a) => a.id !== article.id));
        } else {
            setSelectedArticles([...selectedArticles, article]);
        }
    }


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

                {/* Import Articles */}
                <AlertDialog
                    open={isImportModalOpen} onOpenChange={(open) => {
                        if (open) {
                            setIsImportModalOpen(true)
                        }
                        else {
                            setIsImportModalOpen(false)
                            setExtractedData(null)
                            setDuplicateSlugList([])
                        }
                    }
                    } >
                    {!isDuplicateOpen ? <AlertDialogContent className="w-full max-w-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Import Articles from JSON File
                            </AlertDialogTitle>
                            <AlertDialogDescription className="overflow-y-auto h-96 flex flex-col">
                                <span>
                                    Select a JSON file to import your articles.
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
                                    selectedArticles.map((article) => article.slug).filter((slug, index, self) => self.indexOf(slug) !== index).length > 0 &&
                                    <span className="text-red-500 font-medium mt-0">
                                        {/* check the number of duplicate slugs from selectedArticles */}
                                        {selectedArticles.map((article) => article.slug).filter((slug, index, self) => self.indexOf(slug) !== index).length} duplicate slugs found in the selected articles.
                                        Please resolve them before proceeding.
                                    </span>
                                }

                                <span onClick={() => setIsDuplicateOpen(true)} className={`mt-2 underline ${duplicateSlugGroups.length > 0 ? "text-red-500" : "text-gray-500"} font-medium cursor-pointer`}>
                                    {selectedArticles.map((article) => article.slug).filter((slug, index, self) => self.indexOf(slug) !== index).length > 0 && "View Duplicate Slugs"}
                                </span>

                                <span>
                                    <strong>{selectedArticles.length}</strong> selected out of <strong>{extractedData?.length || 0}</strong> articles
                                </span>

                                {/* Check and uncheck all duplicate slugs radio button */}
                                {duplicateSlugList.length > 0 &&
                                    <div className="flex items-center mt-4">
                                        <Button
                                            className="text-black text-sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedArticles(selectedArticles.filter((article) => !duplicateSlugList.includes(article.slug)))
                                            }}
                                        >

                                            <span>Uncheck all duplicate slugs</span>
                                        </Button>
                                    </div>

                                }

                                {extractedData && (
                                    <ul className="space-y-1 my-5">
                                        {extractedData.map((article, index) => (
                                            <li key={index} className="capitalize flex items-center gap-2 text-black">
                                                <input
                                                    type="checkbox"
                                                    className="text-black"
                                                    checked={selectedArticles.includes(article)}
                                                    onChange={() => handleCheckboxChange(article)}
                                                />
                                                <span className={duplicateSlugList.includes(article.slug) ? "text-red-500" : ""}>{index + 1}. {article.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="w-full flex justify-between my-5">
                                    <span className="text-gray-500 mt-5">
                                        Selected: {selectedArticles.length} of {extractedData?.length}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex items-center space-x-2">
                                                <Globe className="w-4 h-4 mr-2" />
                                                <span className="capitalize">{selectedImportLanguage?.name || "English"}</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {languages?.map((loc) => (
                                                <DropdownMenuItem
                                                    key={loc.id}
                                                    onClick={() => setSelectedImportLanguage(loc)}
                                                    className="capitalize"
                                                >
                                                    {loc.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                disabled={!extractedData || selectedArticles.map((article) => article.slug).filter((slug, index, self) => self.indexOf(slug) !== index).length > 0 || isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSaveExtractedData();
                                }}
                            >
                                {isLoading && <Loader2 className="animate-spin" />}
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent> :
                        (<AlertDialogContent className="w-full max-w-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {selectedArticles.map((article) => article.slug).filter((slug, index, self) => self.indexOf(slug) !== index).length} Duplicate Slugs Found
                                    <div className="my-3 flex items-center space-x-3">
                                        <button className="text-sm shadow-sm border rounded-lg px-3 py-1 disabled:bg-gray-200 disabled:text-gray-500"
                                            disabled={selectedArticles.length === 0 || duplicateSlugGroups.length === 0}
                                            onClick={() => {
                                                // only keep one of the arricles with the same slug
                                                const uniqueSlugs = new Set();
                                                const uniqueArticles = selectedArticles.filter((article) => {
                                                    if (uniqueSlugs.has(article.slug)) {
                                                        return false; // already seen this slug
                                                    } else {
                                                        uniqueSlugs.add(article.slug);
                                                        return true; // keep this article
                                                    }
                                                });
                                                setSelectedArticles(uniqueArticles);
                                            }
                                            }>
                                            Uncheck all duplicates
                                        </button>
                                        <button className="text-sm shadow-sm border rounded-lg px-3 py-1"
                                            onClick={() => {
                                                // check all the duplicate articles
                                                const allDuplicateArticles = duplicateSlugGroups.flat();
                                                setSelectedArticles([
                                                    ...selectedArticles,
                                                    ...allDuplicateArticles
                                                ]);
                                            }
                                            }>
                                            Check all
                                        </button>
                                        <button className="text-sm shadow-sm border rounded-lg px-3 py-1"
                                            onClick={() => {
                                                // uncheck all the duplicate articles
                                                const allDuplicateArticles = duplicateSlugGroups.flat();
                                                setSelectedArticles(
                                                    selectedArticles.filter((a) => !allDuplicateArticles.includes(a))
                                                );
                                            }}>
                                            Uncheck all
                                        </button>
                                    </div>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="overflow-y-auto h-96">
                                    {duplicateSlugGroups && (
                                        <ul className="space-y-2 mb-5">
                                            {duplicateSlugGroups.map((article, index) => (
                                                <li key={index} className="capitalize flex flex-col border p-2 rounded-lg gap-2 text-black">
                                                    {article.map((a, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                className="text-black"
                                                                checked={selectedArticles?.includes(a) || false}
                                                                onChange={() => {
                                                                    handleDuplicateCheckboxChange(a)
                                                                }}
                                                            />
                                                            <span>({a.id}) {a.slug} </span>
                                                        </div>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="w-full flex justify-between my-5">
                                        <span className="text-gray-500 mt-5">
                                            Selected: {selectedArticles.length} of {extractedData?.length}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="flex items-center space-x-2">
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    <span className="capitalize">{selectedImportLanguage?.name || "English"}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {languages?.map((loc) => (
                                                    <DropdownMenuItem
                                                        key={loc.id}
                                                        onClick={() => setSelectedImportLanguage(loc)}
                                                        className="capitalize"
                                                    >
                                                        {loc.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button
                                    onClick={() => {
                                        setIsDuplicateOpen(false)
                                    }}
                                >
                                    Done
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>)
                    }
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