import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const pages = [
    {
      href: {
        pathname: "/basic-counter-page",
        query: {},
      },
      title: "Basic Counter",
      description:
        "A simple counter smart contract interface with increment, decrement, and set number functionality.",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Welcome to my lab</h1>
        <p className="text-lg text-muted-foreground">
          Select a page to get started
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Card
            className="transition-shadow hover:shadow-lg"
            key={page.href.pathname}
          >
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={page.href}>
                <Button className="w-full">Go to {page.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
