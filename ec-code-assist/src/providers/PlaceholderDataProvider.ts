import * as vscode from 'vscode';

export class PlaceholderDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem>;
	public onDidChangeTreeData: vscode.Event<any> | undefined;

	constructor() {
		console.debug("PlaceholderDataProvider created");

		this._onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem>();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	public refresh(): void {
		console.debug("PlaceholderDataProvider.refresh() called");
		this._onDidChangeTreeData.fire(new vscode.TreeItem("Loading..."));
	}

	public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		console.debug("PlaceholderDataProvider.getTreeItem() called");
		return element;
	}

	public getChildren(): vscode.TreeItem[] {
		console.debug("PlaceholderDataProvider.getChildren() called");
		return [
			new vscode.TreeItem("Loading..."),
		];
	}
}