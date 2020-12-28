(function() {
	let output = document.getElementById('posts');

	function renderPosts(posts) {
		output.innerHTML = posts.map(function(p) {
			let tagsHTML = p.tags.map(function(t) {
				return `<li class="tag">${t}</li>`;
			}).join("\n");

			return `<div class="post">
						<div class="content">
							<h2><a href="${p.url}">${p.title}</a></h2>
							<p>${p.description}</p>
						</div>
						<ul class="tags">${tagsHTML}</ul>
					</div>`;
		}).join("\n");
	}

	window.cr = {
		renderPosts: renderPosts
	};
})();