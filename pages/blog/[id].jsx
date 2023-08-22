import { client } from "@/lib/client"
import styles from '@/styles/Blog.module.css'

export default function Blog({ blog }) {
    let blogContents = ""
    for(let i = 0; i < blog.contents.length; i++) {
        blogContents += blog.contents[i].contents
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.blogTitle}>{blog.title}</h1>
            <p className={styles.blogDate}>{blog.createdAt}</p>
            <div
                className={styles.blogContents}
                dangerouslySetInnerHTML={{ __html: `${blogContents}`}}
            >
            </div>
        </main>
    )
}

export const getStaticPaths = async () => {
    const data = await client.get({ endpoint: 'blogs' });

    const paths = data.contents.map((content) => `/blog/${content.id}`);
    return { paths, fallback: false };
}

export const getStaticProps = async (context) => {
    const id = context.params.id
    const data = await client.get({ endpoint: 'blogs', contentId: id })

    return {
        props: {
            blog: data,
        }
    }
}