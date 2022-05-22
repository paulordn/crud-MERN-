import React, { useEffect, useRef } from "react";

const mdRules = [
    { title: "A partir de h1 para h6", rule: "# Cabeçalho -> ###### Cabeçalho" },
    { title: "Bloco de citação", rule: "> Sua citação" },
    { title: "Imagem", rule: "![imagem atl](http://imagem_url.com)" },
    { title: "Link", rule: "[Link de Texto] (http://seu_link.com)" },
];

export default function MarkdownHint() {
    const container = useRef();

    useEffect(() => {
        container.current?.classList.remove("-translate-y-5", "opacity-0");
        container.current?.classList.add("translate-y-0", "opacity-1");
    }, [])
    return (
        <div
            ref={container}
            className="bg-white px-2 py-4 rounded -translate-y-5 opacity-0 transition"
        >
            <h1 className="font-semibold text-center">Regras gerais do markdown</h1>

            <ul className="space-y-2">
                {mdRules.map(({ title, rule }) => {
                    return (
                        <li key={title}>
                            <p className="font-semibold text-gray-500">{title}</p>
                            <p className="font-semibold text-gray-700 pl-2
                             font-mono">
                                {rule}
                            </p>
                        </li>
                    );
                })}
                <li className="text-center text-blue-500">
                    <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank">
                        Saiba Mais
                    </a>
                </li>
            </ul>
        </div>
    );
}