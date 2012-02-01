<div id="contentcontainer" class="container">
	<p><?= message ? message : '' ?></p>
	<form action="/login" method="post">
		<p>Please enter your API key: <input name="key" type="text" size="25" /><input type="submit"></p>
	</form>
</div>
