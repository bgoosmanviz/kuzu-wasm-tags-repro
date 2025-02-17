```
bun install
bun run build
cd dist
npx serve
```

In DevTools, we can see the incorrect result:

```
[
    {
        "n.id": "Entity::Other::Animals",
        "n.tags": [
            "Entity"
        ]
    },
    {
        "n.id": "Entity::Other::Magical amulet",
        "n.tags": [
            "Entity"
        ]
    },
    {
        "n.id": "Entity::Location::Forest",
        "n.tags": [
            "Entity"
        ]
    },
    {
        "n.id": "Entity::Location::Village",
        "n.tags": [
            "Entity"
        ]
    },
    {
        "n.id": "Observation::Lily spends her days conversing with creatures in the forest::1,2::67a67b38b77d8029b915e9d1::Person::/documents/story.pdf::Lily::Location::Forest",
        "n.tags": null
    }
]
```

Since we ran query `MATCH (n) WHERE list_contains(n.tags, 'Entity') RETURN n.id, n.tags;`, we wouldn't expect any results where `n.tags` is `null`.