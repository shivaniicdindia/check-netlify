import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import Head from 'next/head'
import styles from '../../styles/Blog.module.css'

export default function Blog({ frontmatter, markdown}) {
	return (
		<div className={styles['container']}>
			<Head>
      	<title>Demo Blog | {frontmatter.title}</title>
    	</Head>
			<h1 className={styles['title']}>{frontmatter.title}</h1>
			<span>{frontmatter.date}</span>
			<hr />
			<div className={styles['wrapper']}>
				<ReactMarkdown>
					{markdown}
				</ReactMarkdown>
			</div>
		</div>
	)
}

export async function getStaticProps({ params: { slug } }) {
	const fileContent = matter(fs.readFileSync(`./content/blogs/${slug}.md`, 'utf8'))
	let frontmatter = fileContent.data
	const markdown = fileContent.content

	return {
		props: { frontmatter, markdown }
	}
}

export async function getStaticPaths() {
	const filesInProjects = fs.readdirSync('./content/blogs')

	// Getting the filenames excluding .md extension
	// and returning an array containing slug (the filename) as params for every route
	// It looks like this
	// paths = [
	//		{ params: { slug: 'my-first-blog' }},
	//		{ params: { slug: 'how-to-train-a-dragon' }},
	//		{ params: { slug: 'how-to-catch-a-pokemon' }},
	// ]
	const paths = filesInProjects.map(file => {
		const filename = file.slice(0, file.indexOf('.'))
		return { params: { slug: filename }}
	})

	return {
		paths,
		fallback: false // This shows a 404 page if the page is not found
	}
}