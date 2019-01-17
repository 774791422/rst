document.onreadystatechange = function() {
	if(document.readyState == "complete") {
		$("body").fadeIn(500);
	} else {
		document.body.style.display = "none";
	};
};
//侧边导航
$(".navitem").click(function() {
	$(this).addClass("on").siblings().removeClass("on");
})