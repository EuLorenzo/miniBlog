import { useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import PostDetail from "../../components/PostDetail/PostDetail";

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading } = useFetchDocuments({
    docCollection: "posts",
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes.</h1>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.search_form}>
        <input
          type="text"
          placeholder="Ou busque por tags...."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-dark">Pesquisar</button>
      </form>

      <div>
        {loading && <p>Carregando ...</p>}
        {posts &&
          posts.map((post) => {
            return <PostDetail key={post.id} post={post} />;
          })}
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to={"/posts/create"} className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
