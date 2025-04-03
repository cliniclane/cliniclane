import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const locales = [
    { code: "en", name: "English" },
    { code: "du", name: "German" },
    { code: "er", name: "Urdu" }
];

export default function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const changeLocale = (locale: string) => {
        const newPath = `/${locale}${pathname.replace(/^\/[a-z]{2}/, "")}`;
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {locales.find(l => l.code === (currentLocale || "en"))?.name || "English"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map(({ code, name }) => (
                    <DropdownMenuItem key={code} onClick={() => changeLocale(code)}>
                        {name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
