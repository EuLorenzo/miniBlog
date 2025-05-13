import { useEffect, useState } from "react";
import useAuthValue from "../../hooks/useAuthValue";
import styles from "./EditPost.module.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDocument from "../../hooks/useFetchDocument";
import useUpdateDocument from "../../hooks/useUpdateDocument";

const EditPost = () => {
  const { id } = useParams();
  const checkedId = id ?? "0";
  const { document: post } = useFetchDocument({
    docCollection: "posts",
    id: checkedId,
  });
  const { updateDocument, response } = useUpdateDocument("posts");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setTitle(post?.title ?? "Título não encontrado");
    setBody(post?.body ?? "Body não encontrado");
    setImage(post?.image ?? "Imagem não encontrada");

    const textTags = post?.tags.join(", ");
    setTags(textTags ?? "Tags não encontradas");
  }, [post]);

  const { user } = useAuthValue();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    try {
      new URL(image);
    } catch {
      setFormError("A imagem precisa ser uma URL.");
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    if (!title || !image || !body || !tags) {
      setFormError("Por favor, preencha todos os campos!");
    }

    if (formError) return;

    const checkedId = id ?? "0";
    const checkedUid = post?.uid ?? "0";
    const checkeName = user?.displayName ?? "none";

    updateDocument(checkedId, {
      title,
      image,
      body,
      tags: tagsArray,
      uid: checkedUid,
      createdBy: checkeName,
    });

    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando post: {post?.title}</h2>
          <p>Altera os dados do Post como desejar!</p>

          <form onSubmit={(e) => handleSubmit(e)}>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                placeholder="Pense num bom título..."
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>

            <label>
              <span>URL da imagem:</span>
              <input
                type="text"
                name="image"
                placeholder="Insira uma imagem que represente o seu post"
                required
                onChange={(e) => setImage(e.target.value)}
                value={image}
              />
            </label>
            <p className={styles.preview_title}>Preview da imagem atual:</p>
            <img
              className={styles.image_preview}
              src={post.image}
              alt={post.title}
            />

            <label>
              <span>Conteúdo:</span>
              <textarea
                name="body"
                placeholder="Insira o conteúdo do post"
                required
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </label>

            <label>
              <span>Tags:</span>
              <input
                type="text"
                name="tags"
                placeholder="Insira as tags separadas por vírgula"
                required
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </label>
            {!response.loading && <button className="btn">Editar</button>}
            {response.loading && (
              <button className="btn" disabled>
                Aguarde
              </button>
            )}
            {response.error && <p className="error">{response.error}</p>}
            {formError && <p className="error">{formError}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
