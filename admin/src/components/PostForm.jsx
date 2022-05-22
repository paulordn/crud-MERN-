import React, { useEffect, useState } from "react";
import { ImSpinner11, ImEye, ImFilePicture, ImFilesEmpty, ImSpinner3 } from "react-icons/im";
import { uploadImage } from "../api/post";
import { useNotification } from "../context/NotificationProvider";
import DeviceView from "./DeviceView";
import MarkdownHint from "./MarkdownHint";


export const defaultPost = {
    title: "",
    thumbnail: "",
    featured: false,
    content: "",
    tags: "",
    meta: ""
}


export default function PostForm({
    initialPost,
    busy,
    postBtnTitle,
    resetAfterSubmit,
    onSubmit,
}) {
    const [postInfo, setPostInfo] = useState({ ...defaultPost });
    const [selectedThumbnailURL, setSelectedThumbnailURL] = useState("");
    const [imageUrlToCopy, setImageUrlToCopy] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [displayMarkdownHint, setDisplayMarkdownHint] = useState(false);
    const [showDeviceView, setShowDeviceView] = useState(false);

    const { updateNotification } = useNotification();

    useEffect(() => {
        if (initialPost) {
            setPostInfo({ ...initialPost });
            setSelectedThumbnailURL(initialPost?.thumbnail);
        }
        return () => {
            if (resetAfterSubmit) resetForm();
        };
    }, [initialPost, resetAfterSubmit]);

    const handleChange = ({ target }) => {
        const { value, name, checked } = target;

        if (name === "thumbnail") {
            const file = target.files[0];
            if (!file.type?.includes("image")) {
                return updateNotification("error", "Isto não é uma imagem!");
            }
            setPostInfo({ ...postInfo, thumbnail: file });
            return setSelectedThumbnailURL(URL.createObjectURL(file));
        }


        if (name === "featured") {
            localStorage.setItem(
                "blogPost",
                JSON.stringify({ ...postInfo, featured: checked })
            );
            return setPostInfo({ ...postInfo, [name]: checked });
        }

        if (name === "tags") {
            const newTags = tags.split(",");
            if (newTags.length > 4)
                updateNotification("warning", "Apenas as 4 primeiras tags serão selecionadas!");
        }

        if (name === "meta" && meta.length >= 150) {
            return setPostInfo({ ...postInfo, meta: value.substring(0, 149) });
        }

        const newPost = { ...postInfo, [name]: value }

        setPostInfo({ ...newPost });

        localStorage.setItem("blogPost", JSON.stringify(newPost));
    };

    const handleImageUpload = async ({ target }) => {
        if (imageUploading) return;

        const file = target.files[0];

        if (!file.type?.includes("image")) {
            return updateNotification("error", "Isto não é uma imagem!");
        }

        setImageUploading(true)
        const formData = new FormData();
        formData.append("image", file);

        const { error, image } = await uploadImage(formData);
        setImageUploading(false)
        if (error) return updateNotification("error", error);
        setImageUrlToCopy(image);
    };

    const handleOnCopy = () => {
        const textToCopy = `![Adicionar descrição da imagem](${imageUrlToCopy}`;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { title, content, tags, meta } = postInfo;

        if (!title.trim()) return updateNotification("error", "Está faltando o título!");
        if (!content.trim()) return updateNotification("error", "Está faltando o conteúdo!");
        if (!tags.trim()) return updateNotification("error", "Está faltando as tags!");
        if (!meta.trim()) return updateNotification("error", "Está faltando a descrição!");


        const slug = title
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, " ")
            .split(" ")
            .filter(item => item.trim())
            .join("-");

        const newTags = tags
            .split(",")
            .map((item) => item.trim())
            .splice(0, 4);

        const formData = new FormData();
        const finalPost = { ...postInfo, tags: JSON.stringify(newTags), slug };
        for (let key in finalPost) {
            formData.append(key, finalPost[key]);
        }

        onSubmit(formData);
    };

    const resetForm = () => {
        setPostInfo({ ...defaultPost });
        localStorage.removeItem("blogPost");
    }

    const { title, content, featured, tags, meta } = postInfo;

    return (
        <>
            <form onSubmit={handleSubmit} className="p-2 flex">
                <div className="w-9/12 h-screen space-y-3 p-2 flex  flex-col">

                    {/* Título e Envio */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold
                text-gray-700">Criar Novo Post</h1>

                        <div className="flex items-center
                space-x-5 ">
                            <button type="button" onClick={resetForm} className="flex items-center
                     space-x-2 px-3 ring-1 ring-blue-500
                     rounded h-10 text-blue-500 
                     hover:text-white hover:bg-blue-500
                     transition">
                                <ImSpinner11 />
                                <span>Reset</span>
                            </button>
                            <button onClick={() => setShowDeviceView(true)} type="button" className="flex items-center
                    space-x-2 px-3 ring-1 ring-blue-500
                    rounded h-10 text-blue-500
                    hover:text-white hover:bg-blue-500
                     transition">
                                <ImEye />
                                <span>Visualizar</span>
                            </button>
                            <button className="h-10 w-36 
                     hover:ring-1 bg-blue-500 rounded 
                    text-white hover:text-blue-500 
                    hover:bg-transparent ring-blue-500
                    transition">
                                {busy ? (
                                    <ImSpinner3 className="animate-spin mx-auto text-xl" />
                                ) : (
                                    postBtnTitle
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Destaque CheckBox! */}
                    <div className="flex"  >
                        <input
                            name="featured"
                            value={featured}
                            onChange={handleChange}
                            id="featured"
                            type="checkbox"
                            hidden
                        />
                        <label
                            className=" select-none flex items-center
                space-x-2 text-gray-700
                cursor-pointer group"
                            htmlFor="featured"
                        >
                            <div className="w-4 h-4 rounded-full
                     border-2 border-gray-700 flex
                     items-center justify-center
                     group-hover:border-blue-500">
                                {featured && (
                                    <div className="w-2 h-2
                         rounded-full bg-gray-700
                         group-hover:bg-blue-500" />
                                )}
                            </div>
                            <span
                                className="group-hover:text-blue-500">
                                Destaque</span>
                        </label>
                    </div>

                    {/* Título e Input */}
                    <input
                        value={title}
                        onFocus={() => setDisplayMarkdownHint(false)}
                        name="title"
                        onChange={handleChange}
                        type="text"
                        className="text-xl outline-none
             focus:ring-1 rounded p-2 w-full
              font-semibold"
                        placeholder="Título"
                    />

                    {/* Imagem */}

                    <div className="flex space-x-2">

                        <div>
                            <input onChange={handleImageUpload} id="image-input" type="file"
                                hidden />
                            <label
                                htmlFor="image-input"
                                className="flex items-center
                        space-x-2 px-3 ring-1 ring-gray-500
                        rounded h-10 text-gray-700 
                        hover:text-white hover:bg-gray-700
                        transition cursor-pointer">
                                <span>Imagem</span>
                                {!imageUploading ? (
                                    <ImFilePicture />
                                ) : (
                                    <ImSpinner3 className="animate-spin" />
                                )}
                            </label>
                        </div>


                        {imageUrlToCopy && (<div className="flex-1 flex
                justify-between bg-gray-400 rounded
                overflow-hidden">
                            <input
                                type="text"
                                value={imageUrlToCopy}
                                className="bg-transparent px-2 
                        text-white w-full"
                                disabled
                            />

                            <button
                                onClick={handleOnCopy}
                                type="button"
                                className="text-xs flex
                    flex-col items-center justify-center
                    p-1 self-stretch bg-gray-700
                    text-white">
                                <ImFilesEmpty />
                                <span>Cópia</span>
                            </button>
                        </div>
                        )}
                    </div>


                    <textarea
                        value={content}
                        onChange={handleChange}
                        onFocus={() => setDisplayMarkdownHint(true)}
                        name="content"
                        className="resize-none w-full outline-none
              focus:ring-1 rounded p-2 w-full flex-1
              font-mono tracking-wide text-lg"
                        placeholder="## Markdown">
                    </textarea>

                    {/* Tags Input */}
                    <div>
                        <label className="text-gray-500" htmlFor="tags">Tags</label>

                        <input
                            onChange={handleChange}
                            value={tags}
                            name="tags"
                            type="text"
                            id="tags"
                            className="outline-none
                focus:ring-1 rounded p-2 w-full"
                            placeholder="Tag um, Tag dois"
                        />
                    </div>

                    {/* Meta description Input */}
                    <div>
                        <label className="text-gray-500" htmlFor="meta">Descrição {meta?.length} / 150</label>

                        <textarea
                            onChange={handleChange}
                            value={meta}
                            name="meta"
                            id="meta"
                            className="resize-none outline-none
                    focus:ring-1 rounded p-2 w-full h-28"
                            placeholder="Descrição">
                        </textarea>

                    </div>
                </div>

                <div className="w-1/4 px-2 relative">
                    <h1 className="text-xl font-semibold
                text-gray-700 mb-2">Thumbnail</h1>
                    <div>
                        <input
                            onChange={handleChange}
                            name="thumbnail"
                            id="thumbnail"
                            type="file"
                            hidden
                        />
                        <label className="cursor-pointer" htmlFor="thumbnail">
                            {selectedThumbnailURL ? (
                                <img
                                    src={selectedThumbnailURL}
                                    className="aspect-video shadow-sm rounded"
                                    alt=""
                                />
                            ) : (
                                <div className="border border-dashed
                        border-gray-500 aspect-video text-gray-500
                        flex flex-col justify-center items-center">
                                    <span>Selecionar thumbnail</span>
                                    <span className="text-xs">Tamanho recomendado</span>
                                    <span className="text-xs">1280 * 720</span>
                                </div>)}
                        </label>
                    </div>


                    {/* Regras do Markdown */}
                    <div className="absolute top-1/2 -translate-y-1/2">
                        {displayMarkdownHint && <MarkdownHint />}
                    </div>
                </div>
            </form >
            <DeviceView
                title={title}
                content={content}
                thumbnail={selectedThumbnailURL}
                visible={showDeviceView}
                onClose={() => setShowDeviceView(false)}
            />
        </>
    );
}