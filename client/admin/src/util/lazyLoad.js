export default function lazyLoad(path) {
	return resolve => require([path], resolve)
}