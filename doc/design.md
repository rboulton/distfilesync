# Design

## Object store

 - Immutable object store, HTTP2 interface
 - POST objects; returns SHA512 hash if successful.
 - Only returns after object successfully stores.
 - Must be given a SHA512 hash of the object in a header, will validate this matches, and store nothing if not.
 - Either stores complete objects, or stores nothing.
 - GET objects by SHA512 hash only.
 - Supports range queries when getting objects.
 - As compatible with S3 as possible.
 - No metadata storage.
 - Supports DELETE, but no modification.

## File area

 - Named with a URL.
 - A heirarchical list of names mapping to SHA512 hashes.

## File server

 - List of file areas it owns.
 - Doesn't store any file data; just a mapping from name to sha512, and some metadata.
 - Has an ordered list of object stores; each of which should be either complete (have all objects listed in the hash), or a cache (need not have all objects).  Reads will try each in order until the object is found.  Writes will write to all the stores which should be complete.

 - Files added with PUT to a URL.  Returns a response which includes the SHA512, only after the file has been stored in at least one non-cache object store.  Will then update the file area.
 - Files can be got with GET to a URL.  Support range queries, etc.

## Local filesystem monitor / updater

 - Associates a path with the top of a file area on a file server.
 - Scans tree under this path regularly.
 - Keeps a record of the hashes of the files in this tree.
 - Applies any changes detected to the file server; sends files when their hashes don't match.
 - Applies any changes reported by the file server.

## Fuse filesystem

Could implement a fuse filesystem

