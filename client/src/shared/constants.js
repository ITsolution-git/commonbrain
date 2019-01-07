let url;
if (window.location.hostname.indexOf('localhost') != -1)
	url = 'http://localhost:3000'
if (window.location.hostname.indexOf('18.222.107.103') != -1)
	url = 'http://18.222.107.103:3000'
if (window.location.hostname.indexOf('18.191.231.106') != -1)
	url = 'http://18.191.231.106'
if (window.location.hostname.indexOf('commonbrain') != -1)
	url = 'http://commonbrain.io'
export default {
  API_BASE_URL: url,
  PERMISSIONS: [
  	{value: 0, text: 'No Access', pems: []},
  	{value: 1, text: 'Can Read', pems: ['read']},
  	{value: 2, text: 'Can Read and Download', pems: ['read', 'download']},
    {value: 3, text: 'Can Read, Download and Write', pems: ['read', 'download', 'write']}
  ]
}
