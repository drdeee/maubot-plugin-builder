# maubot-plugin-builder
A simple Github action which should pack Maubot plugins.

# Example Workflow
```
name: build
on:
  workflow_dispatch: // You have to trigger this workflow manually
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Project // Download your repo
        uses: actions/checkout@v2
      - name: Build plugin // Build your plugin. The maubot.yaml should be in the root of your repository
        uses: DrDeee/maubot-plugin-builder@v1
        id: build
      - name: Create Release // Create a new release with your plugin version..
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.build.outputs.plugin_version }}
          release_name: Release ${{ steps.build.outputs.plugin_version }}
          body: action
          draft: false
          prerelease: false

      - name: Upload Release Asset // ..and upload your plugin as release asset
        id: upload-release-asset 
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }} # This pulls from the CREATE RELEASE step above, referencing it's ID to get its outputs object, which include a `upload_url`. See this blog post for more info: https://jasonet.co/posts/new-features-of-github-actions/#passing-data-to-future-steps 
          asset_path: ./${{ steps.build.outputs.plugin_file }}
          asset_name: ${{ steps.build.outputs.plugin_file }}
          asset_content_type: application/zip

```
