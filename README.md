# project-journal-frontend

simple web app for tracking status notes across multiple projects

## requirements
- direnv
- asdf

## setup
- run `asdf install`
- copy `.envrc.sample` to `.envrc` and fill in all environment variable values

## lint
- run `npm run lint`

## run (dev)
- run `npm dev`
- access at http://localhost:3000

## build (prod)
- run `npm build`
- (optional) deploy via docker
    - build: `docker build -t project-journal .`
    - run: `docker run -dp 3000:8043 project-journal`
    - access at http://localhost:3000
