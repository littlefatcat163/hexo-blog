(function() {
    const result = sessionStorage.getItem('token');
    if (result === '07bb53649d1a6a6ea66fa37d2e3584f5c30731b69e23f6e9ce2b9ca31b0935502f85a4410b5d256f37a61ab9d2c1b08ef71d217ede3929644f80e6e2329b99da') {
        return;
    }
    window.location.href = '/blog/DIY/login.html';
})()