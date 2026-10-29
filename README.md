# Simple static site code using 11ty, Nunjucks & Contentful

Gets deployed to GitHub Pages - see .github folder for GitHub Actions YAML files to deploy the site & do a Contenful publish webhook

It deploys immediately on git push so setup a 'test' or 'staging' branch if you want to check on web first, then set up a deployment from a merge.

Can be reused for your portfolio, I've kept it as simple as possible! The 11ty local serve can be a bit wonky with the SCSS code I've added...

One thing to note is I'm using Web3Forms for the contact form on the free tier (250 submissions a month). It's a breeze to set up (slightly crappy hCaptcha) but I wouldn't use it for anything more than a simple portfolio. See their site for details: http://web3forms.com/
