"use client";

import { useRouter } from "next/router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
    const router = useRouter();
    const { locale, locales, asPath } = router;

    const handleChange = (newLocale: string) => {
        router.push(asPath, asPath, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="capitalize">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales?.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => handleChange(loc)}
                        className="capitalize"
                    >
                        {loc}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
