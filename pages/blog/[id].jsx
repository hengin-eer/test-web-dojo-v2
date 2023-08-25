import { client } from "@/lib/client"
import { load } from 'cheerio'
import styles from '@/styles/Blog.module.css'

export default function Blog({ blog, contents }) {
    return (
        <main className={styles.container}>
            <h1 className={styles.blogTitle}>{blog.title}</h1>
            <p className={styles.blogDate}>{blog.createdAt}</p>
            <div
                className={styles.blogContents}
                dangerouslySetInnerHTML={{ __html: `${contents}` }}
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

    let blogContents = ""
    for (let i = 0; i < data.contents.length; i++) {
        blogContents += data.contents[i].contents
    }

    const $ = load(blogContents)

    $("div[data-filename]").each((_, elm) => {
        $(elm).prepend(`<span>${$(elm).attr("data-filename")}</span>`)
    })

    $(".blog-card").each((_, elm) => {
        $(elm).html(`<iframe class="hatenablogcard" style="width:100%;height:155px;max-width:680px;" title="${$(elm).text()}" src="https://hatenablog-parts.com/embed?url=${$(elm).text()}" width="300" height="150" frameborder="0" scrolling="no"></iframe>
        `)
    })

    blogContents = $.html()

    return {
        props: {
            blog: data,
            contents: blogContents,
        }
    }
}