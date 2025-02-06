import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';

@Component({
	selector: 'app-blog-post',
	imports: [],
	templateUrl: './blog-post.component.html',
	styleUrl: './blog-post.component.css'
})
export class BlogPostComponent {
	content: string = '';

	constructor(
		private route: ActivatedRoute,
		private http: HttpClient
	) {}

	async ngOnInit() {
		// Get the blog post slug from the URL
		const slug = this.route.snapshot.paramMap.get('slug');

		if (slug) {
			// Load the corresponding markdown file
			this.http.get(`/assets/blog/${slug}.md`, { responseType: 'text' }).subscribe(
				async (data: string) => {
					try {
						// Convert the markdown content to HTML using marked and wait for the result
						this.content = await marked(data);
					} catch (error) {
						console.error('Error processing markdown file:', error);
						this.content = 'Error loading blog post content.';
					}
				},
				(error) => {
					console.error('Error loading markdown file:', error);
					this.content = 'Error loading blog post content.';
				}
			);
		}
	}
}
